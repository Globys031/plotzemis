// For user posted house ads

package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/Globys031/plotzemis/go/db/models"
)

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type buildingUpdateBody struct {
	Id           int64    `json:"id"` // post ID
	UserId       int64    `json:"userId"`
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
	if svc.AuthRequired(ctx) == nil {
		return
	}
	/////////////////////// before creating building, check if plots exists with specified street and plot Ids
	var plot models.Plot
	if plot = svc.getPlot(ctx); plot.Id == 0 {
		return
	}
	/////////////////////

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
	if result := svc.Handler.Database.Where(&models.Building{StreetId: plot.StreetId, PlotId: plot.Id, StreetNumber: body.StreetNumber}).First(&building); result.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "building with this streetID, plotId and street number already exist",
		})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware
	body.UserId = userId.(int64)
	body.StreetId = plot.StreetId
	body.PlotId = plot.Id

	var result = svc.Handler.Database.Create(&body)
	if result.Error != nil {
		fmt.Println(result.Error)
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process building creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"result": body,
	})
}

func (svc *AuthService) ReadBuilding(ctx *gin.Context) {
	var building models.Building
	if building = svc.getBuilding(ctx); building.Id == 0 {
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": building,
	})
}

// This function can be reused by other objects in the hierarchy
func (svc *AuthService) getBuilding(ctx *gin.Context) models.Building {
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	buildingId := getBuildingId(ctx)
	if streetId == 0 || plotId == 0 || buildingId == 0 {
		return models.Building{}
	}

	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetId: streetId, PlotId: plotId, Id: buildingId}).First(&building); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this streetID, plotID and buildingID not found"})
		return models.Building{}
	}
	return building
}

func (svc *AuthService) UpdateBuilding(ctx *gin.Context) {
	if svc.AuthRequired(ctx) == nil {
		return
	}
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	buildingId := getBuildingId(ctx)
	if streetId == 0 || plotId == 0 || buildingId == 0 {
		return
	}

	// Bind post body and validate
	body := buildingUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Get info from userpost based on ID
	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetId: streetId, PlotId: plotId, Id: buildingId, UserId: userId.(int64)}).First(&building); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "building with this streetId, plotId and buildingId not found or your userId doesn't match that of the post's creator",
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
			"error":       "Sql server is down or it couldn't process building creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": building,
	})
}

func (svc *AuthService) RemoveBuilding(ctx *gin.Context) {
	claims := svc.AuthRequired(ctx)
	if claims == nil {
		return
	}
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	buildingId := getBuildingId(ctx)
	if streetId == 0 || plotId == 0 || buildingId == 0 {
		return
	}
	if claims.Role == "ADMIN" {
		svc.RemoveBuildingAdmin(ctx, streetId, plotId, buildingId)
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetId: streetId, PlotId: plotId, Id: buildingId, UserId: userId.(int64)}).First(&building); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this streetId, plotId and buildingId not found  or your userId doesn't match that of the post's creator"})
		return
	}

	// Removes record based on post Id
	if result := svc.Handler.Database.Where("street_id = ? AND plot_id = ? AND id = ? AND user_id = ?", streetId, plotId, buildingId, userId.(int64)).Delete(&models.Building{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this streetId, plotId and buildingId not found or your userId doesn't match that of the post's creator"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": "Building removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) RemoveBuildingAdmin(ctx *gin.Context, streetId int64, plotId int64, buildingId int64) {
	var building models.Building
	if result := svc.Handler.Database.Where(&models.Building{StreetId: streetId, PlotId: plotId, Id: buildingId}).First(&building); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this streetId, plotId and buildingId not found"})
		return
	}

	if result := svc.Handler.Database.Where("street_id = ? AND plot_id = ? AND id = ?", streetId, plotId, buildingId).Delete(&models.Building{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "building with this streetId, plotId and buildingId not found"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": "Building removed",
	})
}

func (svc *AuthService) ReadListBuilding(ctx *gin.Context) {
	/////////////////////// Check if plot exists
	var plot models.Plot
	if plot = svc.getPlot(ctx); plot.Id == 0 {
		return
	}
	/////////////////////

	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	var buildings []models.Building

	if result := svc.Handler.Database.Where(&models.Building{StreetId: streetId, PlotId: plotId}).Find(&buildings); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": buildings,
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

func getBuildingId(ctx *gin.Context) int64 {
	var buildingId int64
	var err error
	if buildingId, err = strconv.ParseInt(ctx.Param("buildingID"), 0, 64); err != nil || buildingId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get buildingID from api request or buildingID = 0"})
		return buildingId
	}
	return buildingId
}
