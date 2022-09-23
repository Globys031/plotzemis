package models

// http://vilnius21.lt/nadruvos-g1142472.html
type Street struct {
	Id       int64  `gorm:"primaryKey" ` // Automatically incremented by database
	UserId   int64  `json:"userId"`
	Name     string `json:"name" validate:"required,max=100,min=4"`
	City     string `json:"city" validate:"required,max=20,min=4"`
	District string `json:"district" validate:"required,max=100,min=4"`
	// pvz 03154
	PostalCode string `json:"postalCode" validate:"required,len=5"`
	// namu (adresu) skaicius
	AddressCount int64  `json:"addressCount" validate:"required,gt=0,lt=9999"`
	StreetLength string `json:"streetLength" validate:"required,max=40,min=2"`
}
