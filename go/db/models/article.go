package models

import "gorm.io/datatypes"

// Skelbimas
type Article struct {
	// Images will be stored in folders based on article's ID
	Id     int64  `gorm:"primaryKey" ` // Automatically incremented by database
	Header string `validate:"required,datetime"`
	// Date        datatypes.Date `validate:"required,datetime"`
	Date        datatypes.Date
	Description string `validate:"max=2000"`
}
