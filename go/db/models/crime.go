// Nusikalstama veikla rajone
package models

type Activity struct {
	Id          int64  `gorm:"primaryKey" `
	District    string `validate:"required,max=40,min=4"`
	Description string `validate:"max=100,min=4"`
	// Unlike the other dates (for comments, posts, etc..)
	// This one can be submitted by the admin user.
	// The other ones get the date automatically calculated.
	Date string `validate:"required,datetime"`
}
