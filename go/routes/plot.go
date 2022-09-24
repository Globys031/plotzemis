// For user posted house ads

package routes

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"

	"github.com/Globys031/plotzemis/go/db/models"
)

type plotGetBody struct {
	StreetName string `json:"streetName"`
	LotNo      int64  `json:"lotNo"`
}

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type plotUpdateBody struct {
	Id         int64    `json:"id"` // post ID
	UserId     int64    `json:"userId"`
	StreetName string   `json:"streetName" validate:"max=100,min=4"`
	LotNo      int64    `json:"lotNo" validate:"gt=0,lt=10000"`
	AreaSize   int64    `json:"areaSize" validate:"gt=0,lt=10000"`
	Purpose    string   `json:"purpose" validate:"plotPurpose"`
	Type       string   `json:"type" validate:"plotType"`
	Fields     []string `json:"fields" validate:"required"`
}

func (svc *AuthService) CreatePlot(ctx *gin.Context) {
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
	if result := svc.Handler.Database.Where(&models.Plot{StreetName: body.StreetName, LotNo: body.LotNo}).First(&plot); result.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "Plot with this street name and lot number not found or your userId doesn't match that of the post's creator",
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

func (svc *AuthService) ReadPlot(ctx *gin.Context) {
	body := plotGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	// Jeigu nuspresiu vis delto sarasa daryt kad grazina. Bet siaip turetu grazint tik viena
	// var plots []models.Plot
	// if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ?", body.StreetName, body.LotNo).Find(&plots); result.Error != nil {

	var user models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{StreetName: body.StreetName, LotNo: body.LotNo}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this street name and lot number not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  user,
	})
}

func (svc *AuthService) UpdatePlot(ctx *gin.Context) {
	// Bind post body and validate
	body := plotUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Get info from userpost based on ID
	var plot models.Plot
	if result := svc.Handler.Database.Where(&models.Plot{StreetName: body.StreetName, LotNo: body.LotNo, UserId: userId.(int64)}).First(&plot); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "Plot with this street name and lot number not found or your userId doesn't match that of the post's creator",
			"serverError": result.Error.Error(),
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
	if body.StreetName != "" {
		plot.StreetName = body.StreetName
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
			"error":       "Sql server is down or it couldn't process user creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  plot,
	})
}

func (svc *AuthService) RemovePlot(ctx *gin.Context) {
	body := plotGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ? AND user_id = ?", body.StreetName, body.LotNo, userId.(int64)).Delete(&models.Plot{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this street name and lot number not found  or your userId doesn't match that of the post's creator"})
		return
	}
	svc.Handler.Database.Where("street_name = ? AND lot_no = ?", body.StreetName, body.LotNo).Delete(&models.Building{})

	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Plot as well as buildings present in this plot have been removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) RemovePlotAdmin(ctx *gin.Context) {
	body := plotGetBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	// Removes record based on post Id
	if result := svc.Handler.Database.Where("street_name = ? AND lot_no = ?", body.StreetName, body.LotNo).Delete(&models.Plot{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Plot with this street name and lot number not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Post removed",
	})
}

func (svc *AuthService) ReadListPlot(ctx *gin.Context) {
	var plots []models.Plot

	result := svc.Handler.Database.Find(&plots)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  plots,
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
	return purpose == "sandėlis" || purpose == "gyvenamasis" || purpose == "agrikultūrinis" || purpose == "miškininkystės"
}

func validatePlotType(fl validator.FieldLevel) bool {
	plotType := strings.ToLower(fl.Field().String())
	return plotType == "nuomojamas" || plotType == "parduodamas" || plotType == "neparduodamas"
}
