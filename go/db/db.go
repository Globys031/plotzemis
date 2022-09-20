package db

import (
	"fmt"
	"log"
	"strings"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm" // https://github.com/go-gorm/gorm
)

type Handler struct {
	Database *gorm.DB
}

func Init(hostname string, user string, passwd string, db_name string, port int) Handler {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable client_encoding=UTF8",
		hostname, user, passwd, db_name, port)

	fmt.Println(dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	// The db.AutoMigrate function will create the table automatically
	// as soon as the application is started.
	// Atkreipt demesi kad darau mounted storage. Reikia susiziuret
	// kaip islaikyt data isjungus konteineri
	if err := db.AutoMigrate(&models.User{}); err == nil {
		fmt.Println("Users table created")
	}

	// will create users "ADMIN" and "MOD" with the same username and password
	// Since these are special users for testing purposes, ignore username
	// and password limitations
	InitPrivilegedUsers(db)

	return Handler{db}
}

// Meant for initializing database with "ADMIN" and "MOD" users for easier development.
func InitPrivilegedUsers(db *gorm.DB) {
	for _, privilege := range []string{"user", "admin", "mod"} {
		var user models.User

		existingUsername := db.Where(&models.User{Username: privilege}).First(&user)
		if existingUsername.Error == nil {
			// Exit if users already created before.
			return
		}

		user.Username = privilege
		user.Email = privilege + "@email.com"
		user.Password = auth.HashPassword(privilege)
		user.Role = strings.ToUpper(privilege)

		var result = db.Create(&user)
		if result.Error != nil {
			fmt.Println("Couldn't create default privileged users during database initilisation")
		}
	}
}
