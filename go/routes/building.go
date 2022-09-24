// For user posted house ads

package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Globys031/plotzemis/go/db/models"
)

type buildingGetBody struct {
	StreetName   string `json:"streetName"`
	LotNo        int64  `json:"lotNo"`
	StreetNumber string `json:"streetNumber"`
}

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type buildingUpdateBody struct {
	Id           int64    `json:"id"` // post ID
	UserId       int64    `json:"userId"`
	StreetName   string   `json:"streetName" validate:"max=100,min=4"`
	LotNo        int64    `json:"lotNo" validate:"gt=0,lt=99999"`
	StreetNumber string   `json:"streetNumber" validate:"max=10,min=1"`
	Type         string   `json:"type" validate:"max=20,min=3"`
	AreaSize     int64    `json:"areaSize" validate:"gt=0,lt=999999"`
	FloorCount   int64    `json:"floorCount" validate:"gt=0,lt=99"`
	Year         int64    `json:"year" validate:"gt=1500,lt=2050"`
	Price        int64    `json:"price" validate:"gt=1,lt=999999999"` // euros
	Fields       []string `json:"fields" validate:"required"`
}

func (svc *AuthService) CreateBuilding(ctx *gin.Context) {
	body := models.Building{}

	if err := ctx.BindJSON(&body); err != nil {
		fmt.Println(err.Error())
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	if err := validateBuildingDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetName: body.StreetName, LotNo: body.LotNo, StreetNumber: body.StreetNumber}).First(&building); result.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "building with this street name, lot number and street number already exist",
		})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware
	body.UserId = userId.(int64)

	var result = svc.Handler.Database.Create(&body)
	if result.Error != nil {
		fmt.Println(result.Error)
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  body,
	})
}

func (svc *AuthService) ReadBuilding(ctx *gin.Context) {
	body := buildingGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	// var buildings []models.Building
	// if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ? AND lot_no = ?", body.StreetName, body.LotNo).Find(&buildings); result.Error != nil {

	var buildings models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetName: body.StreetName, LotNo: body.LotNo, StreetNumber: body.StreetNumber}).First(&buildings); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this street name, lot number and street number not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  buildings,
	})
}

func (svc *AuthService) UpdateBuilding(ctx *gin.Context) {
	// Bind post body and validate
	body := buildingUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Get info from userpost based on ID
	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetName: body.StreetName, LotNo: body.LotNo, StreetNumber: body.StreetNumber, UserId: userId.(int64)}).First(&building); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "building with this street name, lot number and street number not found or your userId doesn't match that of the post's creator",
			"serverError": result.Error.Error(),
		})
		return
	}

	//////////////////////
	// Needed for proper validation
	if body.AreaSize != 0 {
		building.AreaSize = body.AreaSize
	}
	if body.FloorCount != 0 {
		building.Price = body.Price
	}
	if body.LotNo != 0 {
		building.LotNo = body.LotNo
	}
	if body.Year != 0 {
		building.Year = body.Year
	}
	if body.Price != 0 {
		building.Price = body.Price
	}
	if body.StreetName != "" {
		building.StreetName = body.StreetName
	}
	if body.StreetNumber != "" {
		building.StreetNumber = body.StreetNumber
	}
	if body.Type != "" {
		building.Type = body.Type
	}
	////////////

	if err := validateBuildingDataFormat(&building, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only the fields specified.
	var result = svc.Handler.Database.Save(&building)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  building,
	})
}

func (svc *AuthService) RemoveBuilding(ctx *gin.Context) {
	body := buildingGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Removes record based on post Id
	if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ? AND street_number = ? AND user_id = ?", body.StreetName, body.LotNo, body.StreetNumber, userId.(int64)).Delete(&models.Building{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this street name, lot number and street number not found  or your userId doesn't match that of the post's creator"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Post removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) RemoveBuildingAdmin(ctx *gin.Context) {
	body := buildingGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ? AND street_number = ?", body.StreetName, body.LotNo, body.StreetNumber).Delete(&models.Building{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this street name, lot number and street number not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Post removed",
	})
}

func (svc *AuthService) ReadListBuilding(ctx *gin.Context) {
	var buildings []models.Building

	result := svc.Handler.Database.Find(&buildings)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  buildings,
	})
}

///////////////////////////////
// Helper functions
///////////////////////////////

func validateBuildingDataFormat(building *models.Building, svc *AuthService) error {
	err := validate.Struct(building)
	if err != nil {
		fmt.Println(err)
	}
	return err
}
