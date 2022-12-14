// For user posted house ads

package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"

	"github.com/Globys031/plotzemis/go/db/models"
)

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type plotUpdateBody struct {
	Id       int64    `json:"id"` // post ID
	UserId   int64    `json:"userId"`
	LotNo    int64    `json:"lotNo" validate:"gt=0,lt=10000"`
	AreaSize int64    `json:"areaSize" validate:"gt=0,lt=10000"`
	Purpose  string   `json:"purpose" validate:"plotPurpose"`
	Type     string   `json:"type" validate:"plotType"`
	Fields   []string `json:"fields" validate:"required"`
}

func (svc *AuthService) CreatePlot(ctx *gin.Context) {
	if svc.AuthRequired(ctx) == nil {
		return
	}
	/////////////////////// Check if street exists
	var street models.Street
	if street = svc.getStreet(ctx); street.Id == 0 {
		return
	}
	/////////////////////

	body := models.Plot{}

	if err := ctx.BindJSON(&body); err != nil {
		fmt.Println(err.Error())
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	if err := validatePlotDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var plot models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{LotNo: body.LotNo, StreetId: street.Id}).First(&plot); result.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "Plot with this lot number and streetID already exists",
		})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware
	body.UserId = userId.(int64)
	body.StreetId = street.Id

	var result = svc.Handler.Database.Create(&body)
	if result.Error != nil {
		fmt.Println(result.Error)
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process plot creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"result": body,
	})
}

func (svc *AuthService) ReadPlot(ctx *gin.Context) {

	var plot models.Plot
	if plot = svc.getPlot(ctx); plot.Id == 0 {
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": plot,
	})
}

// This function can be reused by other objects in the hierarchy
func (svc *AuthService) getPlot(ctx *gin.Context) models.Plot {
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	if streetId == 0 || plotId == 0 {
		return models.Plot{}
	}

	var plot models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{StreetId: streetId, Id: plotId}).First(&plot); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this streetId and plotId not found"})
		return models.Plot{}
	}
	return plot
}

func (svc *AuthService) UpdatePlot(ctx *gin.Context) {
	if svc.AuthRequired(ctx) == nil {
		return
	}
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	if streetId == 0 || plotId == 0 {
		return
	}

	// Bind post body and validate
	body := plotUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	var plot models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{StreetId: streetId, Id: plotId, UserId: userId.(int64)}).First(&plot); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "Plot with this streetID and plotID not found or your userId doesn't match that of the post's creator",
		})
		return
	}
	//////////////////////
	// Needed for proper validation
	if body.AreaSize != 0 {
		plot.AreaSize = body.AreaSize
	}
	if body.LotNo != 0 {
		plot.LotNo = body.LotNo
	}
	if body.Purpose != "" {
		plot.Purpose = body.Purpose
	}
	if body.Type != "" {
		plot.Type = body.Type
	}
	////////////

	if err := validatePlotDataFormat(&plot, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only the fields specified.
	var result = svc.Handler.Database.Save(&plot)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process plot creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": plot,
	})
}

func (svc *AuthService) RemovePlot(ctx *gin.Context) {
	claims := svc.AuthRequired(ctx)
	if claims == nil {
		return
	}
	streetId := getStreetId(ctx)
	plotId := getPlotId(ctx)
	if streetId == 0 || plotId == 0 {
		return
	}
	if claims.Role == "ADMIN" {
		svc.removePlotAdmin(ctx, streetId, plotId)
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	var plot models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{StreetId: streetId, Id: plotId, UserId: userId.(int64)}).First(&plot); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this streetId and plotId not found or your userId doesn't match that of the post's creator"})
		return
	}

	if result := svc.Handler.Database.Where("street_id = ? AND id = ? AND user_id = ?", streetId, plotId, userId.(int64)).Delete(&models.Plot{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this streetId and plotId not found or your userId doesn't match that of the post's creator"})
		return
	}

	// Cia dar sugrizt...
	svc.Handler.Database.Where("street_id = ? AND plot_id = ?", streetId, plotId).Delete(&models.Building{})

	ctx.JSON(http.StatusOK, gin.H{
		"result": "Plot as well as buildings present in this plot have been removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) removePlotAdmin(ctx *gin.Context, streetId int64, plotId int64) {
	var plot models.Plot
	if resultTest := svc.Handler.Database.Where("street_id = ? AND id = ?", streetId, plotId).First(&plot); resultTest.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this streetId and plotId not found"})
		return
	}

	if result := svc.Handler.Database.Where("street_id = ? AND id = ?", streetId, plotId).Delete(&models.Plot{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Couldn't delete plot with this streetId and plotId not found"})
		return
	}
	svc.Handler.Database.Where("street_id = ? AND plot_id = ?", streetId, plotId).Delete(&models.Building{})

	ctx.JSON(http.StatusOK, gin.H{
		"result": "Plot as well as buildings associated with it have been removed",
	})
}

func (svc *AuthService) ReadListPlot(ctx *gin.Context) {
	/////////////////////// Check if street exists
	var street models.Street
	if street = svc.getStreet(ctx); street.Id == 0 {
		return
	}
	/////////////////////

	streetId := getStreetId(ctx)
	var plots []models.Plot

	if result := svc.Handler.Database.Where(&models.Plot{StreetId: streetId}).Find(&plots); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": plots,
	})
}

///////////////////////////////
// Helper functions
///////////////////////////////

func validatePlotDataFormat(plot *models.Plot, svc *AuthService) error {
	validate.RegisterValidation("plotPurpose", validatePlotPurpose)
	validate.RegisterValidation("plotType", validatePlotType)
	err := validate.Struct(plot)
	if err != nil {
		fmt.Println(err)
	}
	return err
}

func validatePlotPurpose(fl validator.FieldLevel) bool {
	purpose := strings.ToLower(fl.Field().String())
	return purpose == "sand??lis" || purpose == "gyvenamasis" || purpose == "agrikult??rinis" || purpose == "mi??kininkyst??s"
}

func validatePlotType(fl validator.FieldLevel) bool {
	plotType := strings.ToLower(fl.Field().String())
	return plotType == "nuomojamas" || plotType == "parduodamas" || plotType == "neparduodamas"
}

func getPlotId(ctx *gin.Context) int64 {
	var plotId int64
	var err error
	if plotId, err = strconv.ParseInt(ctx.Param("plotID"), 0, 64); err != nil || plotId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get plotID from api request or plotID = 0"})
		return plotId
	}
	return plotId
}
