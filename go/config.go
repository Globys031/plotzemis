package main

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	Postgres_user     string `mapstructure:"POSTGRES_USER"`
	Postgres_password string `mapstructure:"POSTGRES_PASSWORD"`
	Postgres_hostname string `mapstructure:"POSTGRES_HOSTNAME"`
	Postgres_port     int    `mapstructure:"POSTGRES_PORT"`
	Adminer_port      int    `mapstructure:"ADMINER_PORT"`

	JWT_secret_key string `mapstructure:"JWT_SECRET_KEY"`

	Backend_port int    `mapstructure:"BACKEND_PORT"`
	Backend_host string `mapstructure:"BACKEND_HOST"`
}

func LoadConfig() (c Config, err error) {
	viper.AddConfigPath(".")
	viper.SetConfigName("dev")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&c)

	fmt.Println(c)
	return
}
