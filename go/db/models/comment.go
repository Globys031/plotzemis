package models

type Comment struct {
	Id int64 `gorm:"primaryKey" ` // Automatically incremented by database
	// Id of the ad this comment is associated with
	PostId int64  `validate:"required,max=20,min=6"`
	Body   string `validate:"max=200"`
}
