package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/db"
	library "github.com/Globys031/grpc-web-video-streaming/authServer/go/protoLibrary"
	"github.com/Globys031/grpc-web-video-streaming/authServer/go/utils"

	auth "github.com/Globys031/grpc-web-video-streaming/authServer/go/auth"
	globalConfig "github.com/Globys031/grpc-web-video-streaming/config"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

var (
	enableTls              = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
	tlsCertFilePath        = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
	tlsKeyFilePath         = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
	auth_frontend_port     = 8082 // default value. Will be changed depending on .env
	auth_frontend_ssl_port = 8083
)

func allowedOriginCors(origin string) bool {

	allowedOrigins := []string{
		"http://localhost:" + strconv.Itoa(auth_frontend_port),
		"https://localhost:" + strconv.Itoa(auth_frontend_ssl_port),
		"http://127.0.0.1:" + strconv.Itoa(auth_frontend_port),
	}
	fmt.Println(allowedOrigins)
	for _, allowedOrigin := range allowedOrigins {
		if allowedOrigin == origin {
			return true
		}
	}
	return false
}

func main() {
	config, err := globalConfig.LoadConfig()
	auth_frontend_port = config.Auth_frontend_port
	auth_frontend_ssl_port = config.Auth_frontend_ssl_port

	if err != nil {
		log.Fatalln("Failed at config", err)
	}

	// DB_URL=postgres://<user>:<password>@<host>:<port>/<name>
	// DB_URL := "postgres://" + config.Postgres_user + ":" + config.Postgres_password + "@" + config.Postgres_hostname +
	// db_handler := db.Init(config.Database_URL)
	db_name := "auth_svc"
	db_handler := db.Init(config.Postgres_hostname, config.Postgres_user, config.Postgres_password, db_name, config.Postgres_port)

	jwt := utils.JwtWrapper{
		SecretKey:       config.JWT_secret_key,
		Issuer:          "go-grpc-auth-svc",
		ExpirationHours: 24 * 365,
	}

	////////////////////////
	////////////////////////
	////////////////////////
	////////////////////////

	flag.Parse()

	port := config.Auth_backend_port
	if *enableTls {
		port = config.Auth_backend_ssl_port
	}

	grpcServer := grpc.NewServer()

	library.RegisterAuthServiceServer(grpcServer,
		&auth.AuthService{
			Handler: db_handler,
			Jwt:     jwt,
		})

	grpclog.SetLogger(log.New(os.Stdout, "authserver: ", log.LstdFlags))

	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(allowedOriginCors))
	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := &http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", port),
		Handler: http.HandlerFunc(handler),
	}

	grpclog.Printf("Starting authentication server. http port: %v, with TLS: %v", port, *enableTls)

	if *enableTls {
		if err := httpServer.ListenAndServeTLS(*tlsCertFilePath, *tlsKeyFilePath); err != nil {
			grpclog.Fatalf("failed starting http2 authentication server: %v", err)
		}
	} else {
		if err := httpServer.ListenAndServe(); err != nil {
			grpclog.Fatalf("failed starting http authentication server: %v", err)
		}
	}
}
