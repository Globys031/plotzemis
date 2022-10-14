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
type streetUpdateBody struct {
	Name         string `json:"name" validate:"max=100,min=4"`
	City         string `json:"city" validate:"max=20,min=4"`
	District     string `json:"district" validate:"max=100,min=4"`
	AddressCount int64  `json:"addressCount" validate:"gt=0,lt=9999"`
	StreetLength string `json:"streetLength" validate:"max=40,min=2"`
}

func (svc *AuthService) CreateStreet(ctx *gin.Context) {
	if svc.AuthRequired(ctx) == nil {
		return
	}
	body := models.Street{}

	if err := ctx.BindJSON(&body); err != nil {
		fmt.Println(err.Error())
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	if err := validateStreetDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var street models.Street
	if result := svc.Handler.Database.Where(&models.Street{Name: body.Name}).First(&street); result.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "Street with such a name already exists"})
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
		"result": body,
	})
}

// CRUD GET function
func (svc *AuthService) ReadStreet(ctx *gin.Context) {
	var street models.Street
	if street = svc.getStreet(ctx); street.Id == 0 {
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": street,
	})
}

// This function can be reused by other objects in the hierarchy
func (svc *AuthService) getStreet(ctx *gin.Context) models.Street {
	var streetId int64
	var err error
	if streetId, err = strconv.ParseInt(ctx.Param("streetID"), 0, 64); err != nil || streetId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get streetID from api request or streetId = 0"})
		return models.Street{}
	}

	var street models.Street
	if result := svc.Handler.Database.Where(&models.Street{Id: streetId}).First(&street); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this Id not found"})
		return models.Street{}
	}
	return street
}

func (svc *AuthService) UpdateStreet(ctx *gin.Context) {
	if svc.AuthRequired(ctx) == nil {
		return
	}
	var streetId int64
	var err error
	if streetId, err = strconv.ParseInt(ctx.Param("streetID"), 0, 64); err != nil || streetId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get streetID from api request or streetId = 0"})
		return
	}

	// Bind post body and validate
	body := streetUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Get info from street based on name
	var street models.Street
	if result := svc.Handler.Database.Where(&models.Street{Id: streetId, UserId: userId.(int64)}).First(&street); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "Street with this Id not found or your userId doesn't match that of the post's creator",
		})
		return
	}
	//////////////////////
	// Only update with fields provided
	if body.AddressCount != 0 {
		street.AddressCount = body.AddressCount
	}
	if body.City != "" {
		street.City = body.City
	}
	if body.District != "" {
		street.District = body.District
	}
	if body.Name != "" {
		street.Name = body.Name
	}
	if body.StreetLength != "" {
		street.StreetLength = body.StreetLength
	}
	////////////

	if err := validateStreetDataFormat(&street, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only the fields specified.
	var result = svc.Handler.Database.Save(&street)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"serverError": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": street,
	})
}

func (svc *AuthService) RemoveStreet(ctx *gin.Context) {
	claims := svc.AuthRequired(ctx)
	if claims == nil {
		return
	}
	var streetId int64
	var err error
	if streetId, err = strconv.ParseInt(ctx.Param("streetID"), 0, 64); err != nil || streetId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get streetID from api request or streetId = 0"})
		return
	}
	if claims.Role == "ADMIN" {
		svc.removeStreetAdmin(ctx, streetId)
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Quick and dirty work-around because remove seems to always return successful even
	// if there was no element to be found.
	var street models.Street

	if resultTest := svc.Handler.Database.Where("id = ? AND user_id = ?", streetId, userId.(int64)).First(&street); resultTest.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Street with this id not found  or your userId doesn't match that of the post's creator"})
		return
	}

	if result := svc.Handler.Database.Where("id = ? AND user_id = ?", streetId, userId.(int64)).Delete(&models.Street{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Couldn't delete street with this id not found  or your userId doesn't match that of the post's creator"})
		return
	}

	// Cia dar sugrizt...
	svc.Handler.Database.Where("street_id = ?", streetId).Delete(&models.Plot{})
	svc.Handler.Database.Where("street_id = ?", streetId).Delete(&models.Building{})

	ctx.JSON(http.StatusOK, gin.H{
		"result": "Street as well as plots and buildings associated with it have been removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) removeStreetAdmin(ctx *gin.Context, streetId int64) {
	fmt.Println("street_id", streetId)
	var street models.Street
	if resultTest := svc.Handler.Database.Where("id = ?", streetId).First(&street); resultTest.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this Id not found"})
		return
	}

	if result := svc.Handler.Database.Where("id = ?", streetId).Delete(&models.Street{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Couldn't delete street with this Id not found"})
		return
	}
	svc.Handler.Database.Where("street_id = ?", streetId).Delete(&models.Plot{})
	svc.Handler.Database.Where("street_id = ?", streetId).Delete(&models.Building{})

	ctx.JSON(http.StatusOK, gin.H{
		"result": "Street as well as plots and buildings associated with it have been removed",
	})
}

func (svc *AuthService) ReadListStreet(ctx *gin.Context) {
	var streets []models.Street

	result := svc.Handler.Database.Find(&streets)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"result": streets,
	})
}

///////////////////////////////
// Helper functions
///////////////////////////////

func validateStreetDataFormat(street *models.Street, svc *AuthService) error {
	err := validate.Struct(street)
	if err != nil {
		fmt.Println(err)
	}
	return err
}

func getStreetId(ctx *gin.Context) int64 {
	var streetId int64
	var err error
	if streetId, err = strconv.ParseInt(ctx.Param("streetID"), 0, 64); err != nil || streetId == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Either couldn't get streetID from api request or streetId = 0"})
		return streetId
	}
	return streetId
}
