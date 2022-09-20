package models

// https://github.com/lib/pq

// https://medium.com/@apzuk3/input-validation-in-golang-bc24cdec1835
// This struct is used for database storage. A different user struct is returned
// to frontend upon login
type User struct {
	UserId       int64  `gorm:"primaryKey" ` // Automatically incremented by database
	Username string `validate:"required,max=20,min=6"`
	Password string `validate:"required,max=40,min=8"`
	Email    string `validate:"required,email"`
	Role string `validate:"required,role"`
}
