// For user posted house ads

package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Globys031/plotzemis/go/db/models"
)

type streetGetBody struct {
	Name string `json:"name"`
}

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type streetUpdateBody struct {
	NewName      string `json:"newName" validate:"max=100,min=4"`
	OldName      string `json:"oldName" validate:"max=100,min=4"`
	City         string `json:"city" validate:"max=20,min=4"`
	District     string `json:"district" validate:"max=100,min=4"`
	PostalCode   string `json:"postalCode" validate:"len=5"`
	AddressCount int64  `json:"addressCount" validate:"gt=0,lt=9999"`
	StreetLength string `json:"streetLength" validate:"max=40,min=2"`
}

func (svc *AuthService) CreateStreet(ctx *gin.Context) {
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
		"success": "true",
		"result":  body,
	})
}

func (svc *AuthService) ReadStreet(ctx *gin.Context) {
	// jsonData, _ := ioutil.ReadAll(ctx.Request.Body)
	// fmt.Println(string(jsonData))

	var name string
	if name = ctx.Query("name"); name == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect request format"})
		return
	}

	var street models.Street
	if result := svc.Handler.Database.Where(&models.Street{Name: name}).First(&street); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this name not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  street,
	})
}

func (svc *AuthService) UpdateStreet(ctx *gin.Context) {
	// Bind post body and validate
	body := streetUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil || body.OldName == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Get info from street based on name
	var street models.Street
	if result := svc.Handler.Database.Where(&models.Street{Name: body.OldName, UserId: userId.(int64)}).First(&street); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "Street with this name not found or your userId doesn't match that of the post's creator",
			"serverError": result.Error.Error(),
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
	if body.NewName != "" {
		street.Name = body.NewName
	}
	if body.PostalCode != "" {
		street.PostalCode = body.PostalCode
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
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  street,
	})
}

func (svc *AuthService) RemoveStreet(ctx *gin.Context) {
	var name string
	if name = ctx.Query("name"); name == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect request format"})
		return
	}

	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Quick and dirty work-around because remove seems to always return successful even
	// if there was no element to be found.
	var street models.Street
	if resultTest := svc.Handler.Database.Where("name = ? AND user_id = ?", name, userId.(int64)).First(&street); resultTest.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this name not found  or your userId doesn't match that of the post's creator"})
		return
	}

	if result := svc.Handler.Database.Where("name = ? AND user_id = ?", name, userId.(int64)).Delete(&models.Street{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this name not found  or your userId doesn't match that of the post's creator"})
		return
	}

	svc.Handler.Database.Where("street_name = ?", name).Delete(&models.Plot{})
	svc.Handler.Database.Where("street_name = ?", name).Delete(&models.Building{})

	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Street as well as plots and buildings associated with it have been removed",
	})
}

// Admins don't need to be the ones who created the post to remove it
// If admin authentication succeeded, no further checks needed.
func (svc *AuthService) RemoveStreetAdmin(ctx *gin.Context) {
	var name string
	if name = ctx.Query("name"); name == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect request format"})
		return
	}

	var street models.Street
	if resultTest := svc.Handler.Database.Where("name = ?", name).First(&street); resultTest.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this name not found"})
		return
	}

	if result := svc.Handler.Database.Where("name = ?", name).Delete(&models.Street{}); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Street with this name not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Post removed",
	})
}

func (svc *AuthService) ReadListStreet(ctx *gin.Context) {
	var streets []models.Street

	result := svc.Handler.Database.Find(&streets)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  streets,
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
