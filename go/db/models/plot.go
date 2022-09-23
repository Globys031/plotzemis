package models

// https://m.en.aruodas.lt/sklypai-vilniuje-pavilnyje-valdemaro-carneckio-g-ieskote-sklypo-ir-norite-statytis-individualu-11-1263626/?return_url=%2Fsklypai%2F%3Fobj%3D11
// https://m.en.aruodas.lt/sklypai-klaipedos-rajone-baukstininku-k-patrimpo-g-parduodamas-sklypas-sklypo-dalis-projekto-11-1282769/?return_url=%2Fsklypai%2F%3Fobj%3D11
// https://m.en.aruodas.lt/sklypai-vilniuje-paneriuose-lentvario-g-isnuomojama-aikstele-lentvario-g-prie-misko-11-1281525/?return_url=%2Fsklypai%2F%3Fobj%3D11

type Plot struct {
	// Palikt Id for convenience sake. Tiesiog dedant paziuret ar jau toks
	// lot number egzistuoja ar ne
	Id         int64  `gorm:"primaryKey" ` // Automatically incremented by database
	UserId     int64  `json:"userId"`
	StreetName string `json:"streetName" validate:"required,max=100,min=4"`
	LotNo      int64  `json:"lotNo" validate:"required,gt=0,lt=10000"`
	// arais
	AreaSize int64 `json:"areaSize" validate:"required,gt=0,lt=10000"`
	// [Sandėlis, Gyvenamasis, agrikultūrinis, miškininkystės]
	Purpose string `json:"purpose" validate:"required,plotPurpose"`
	// [nuomojamas, parduodamas, neparduodamas]
	Type string `json:"type" validate:"required,plotType"`
}
