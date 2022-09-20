package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db"
	"github.com/Globys031/plotzemis/go/routes"
)

var (
	enableTls          = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
	tlsCertFilePath    = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
	tlsKeyFilePath     = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
)

func main() {
	flag.Parse() // parses the above flag variables
	//////////////////////////
	// Loads configs
	config, err := LoadConfig()
	if err != nil {
		log.Fatalln("Failed at config", err)
	}
	port := config.Backend_port
	//////////////////////////

	//////////////////////////
	// Initialises database and jwt
	//
	// DB_URL=postgres://<user>:<password>@<host>:<port>/<name>
	db_name := "auth_svc"
	db_handler := db.Init(config.Postgres_hostname, config.Postgres_user, config.Postgres_password, db_name, config.Postgres_port)

	jwt := auth.JwtWrapper{
		SecretKey:       config.JWT_secret_key,
		Issuer:          "go-grpc-auth-svc",
		ExpirationHours: 24 * 365,
	}
	authSvc := &routes.AuthService{
		Handler: db_handler,
		Jwt:     jwt,
	}
	//////////////////////////

	//////////////////////////
	// Initialise webserver and routes
	router := routes.RegisterRoutes(authSvc)
	Addr := fmt.Sprintf("127.0.0.1:%d", port)
	if *enableTls {
		if err := router.RunTLS(Addr, *tlsCertFilePath, *tlsKeyFilePath); err != nil {
			fmt.Errorf("failed starting http2 backend server: %v", err)
		}
	} else {
		if err := router.Run(Addr); err != nil {
			fmt.Errorf("failed starting http backend server: %v", err)
		}
	}
}
