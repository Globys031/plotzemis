package models

// https://www.aruodas.lt/butu-nuoma-vilniuje-kalnenuose-guriu-g-nuomoju-erdvu-dvieju-kambariu-buta-su-baldais-4-1175231/

type Building struct {
	Id       int64 `gorm:"primaryKey" `
	UserId   int64 `json:"userId"`
	StreetId int64 `json:"streetId"`
	PlotId   int64 `json:"plotId"`

	LotNo        int64  `json:"lotNo" validate:"required,gt=0,lt=99999"`
	StreetNumber string `json:"streetNumber" validate:"required,max=10,min=1"`
	// pvz 03154
	PostalCode string `json:"postalCode" validate:"required,len=5"`

	// Pvz butas, namas, garazas, aikstele
	Type string `json:"type" validate:"required,max=20,min=3"`
	// square meters
	AreaSize   int64 `json:"areaSize" validate:"required,gt=0,lt=999999"`
	FloorCount int64 `json:"floorCount" validate:"required,gt=-1,lt=99"`
	// The year it was built
	Year int64 `json:"year" validate:"required,gt=1500,lt=2050"`
	// Will be how many euros a month if for rent. Otherwise just overall price
	Price int64 `json:"price" validate:"required,gt=1,lt=999999999"` // euros

}
