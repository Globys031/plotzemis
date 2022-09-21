package models

type City struct {
	Id   int64  `gorm:"primaryKey" ` // Automatically incremented by database
	Name string `validate:"required,max=40,min=4"`
}
