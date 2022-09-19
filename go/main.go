package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/Globys031/plotzemis/go/db"
	"github.com/Globys031/plotzemis/go/utils"
)

var (
	enableTls              = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
	tlsCertFilePath        = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
	tlsKeyFilePath         = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
	auth_frontend_port     = 8080 // default value. Will be changed depending on .env
)

func initRoutes() {
	router := mux.NewRouter()

	// Any requests to user/admin level will need additional authentication
	router.HandleFunc("/user/", HandlerWrapper(GETHandler, globalID, topics)).Methods("GET")
	router.HandleFunc("/user/", HandlerWrapper(POSTHandler, globalID, topics)).Methods("POST")
	router.HandleFunc("/admin/", HandlerWrapper(GETHandler, globalID, topics)).Methods("GET")
	router.HandleFunc("/admin/", HandlerWrapper(POSTHandler, globalID, topics)).Methods("POST")
	router.HandleFunc("/", HandlerWrapper(GETHandler, globalID, topics)).Methods("GET")
	router.HandleFunc("/", HandlerWrapper(GETHandler, globalID, topics)).Methods("POST")
}

func main() {
	//////////////////////////
	// Loads configs
	config, err := Config.LoadConfig()
	if err != nil {
		log.Fatalln("Failed at config", err)
	}
	port := config.backend_port
	//////////////////////////
	// Initialises database and jwt
	//
	// DB_URL=postgres://<user>:<password>@<host>:<port>/<name>
	db_name := "auth_svc"
	db_handler := db.Init(config.Postgres_hostname, config.Postgres_user, config.Postgres_password, db_name, config.Postgres_port)

	jwt := utils.JwtWrapper{
		SecretKey:       config.JWT_secret_key,
		Issuer:          "go-grpc-auth-svc",
		ExpirationHours: 24 * 365,
	}
	//////////////////////////
	// Starts the webserver
	initRoutes()


	flag.Parse()


	// grpcServer := grpc.NewServer()

	// library.RegisterAuthServiceServer(grpcServer,
	// 	&auth.AuthService{
	// 		Handler: db_handler,
	// 		Jwt:     jwt,
	// 	})

	// grpclog.SetLogger(log.New(os.Stdout, "authserver: ", log.LstdFlags))

	// wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(allowedOriginCors))
	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := &http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", port),
		Handler: http.HandlerFunc(handler),
	}

	grpclog.Printf("Starting backend server. http port: %v, with TLS: %v", port, *enableTls)

	if *enableTls {
		if err := httpServer.ListenAndServeTLS(*tlsCertFilePath, *tlsKeyFilePath); err != nil {
			grpclog.Fatalf("failed starting http2 backend server: %v", err)
		}
	} else {
		if err := httpServer.ListenAndServe(); err != nil {
			grpclog.Fatalf("failed starting http backend server: %v", err)
		}
	}
}
