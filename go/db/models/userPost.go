package models

import "gorm.io/datatypes"

// import "gorm.io/datatypes"

// Skelbimas
type UserPost struct {
	Id          int64          `gorm:"primaryKey" ` // Automatically incremented by database
	City        string         `json:"city" validate:"required,max=20,min=6"`
	District    string         `json:"district" validate:"required,max=40,min=8"`
	AreaSize    int64          `json:"areasize" validate:"required,gt=1,lt=999999"` // square meters
	Price       int64          `json:"price" validate:"required,gt=1,lt=999999999"` // euros
	RoomCount   int64          `json:"roomcount" validate:"required,gt=1,lt=999"`
	Date        datatypes.Date `json:"date"`
	Description string         `json:"description" validate:"max=2000"`
}
