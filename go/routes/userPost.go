// For user posted house ads

package routes

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"

	"github.com/Globys031/plotzemis/go/db/models"
)

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type UserPostUpdateBody struct {
	Id          int64          `json:"id"`
	City        string         `json:"city" validate:"max=20,min=6"`
	District    string         `json:"district" validate:"max=40,min=8"`
	AreaSize    int64          `json:"areasize" validate:"gt=1,lt=999999"` // square meters
	Price       int64          `json:"price" validate:"gt=1,lt=999999999"` // euros
	RoomCount   int64          `json:"roomcount" validate:"gt=1,lt=999"`
	Date        datatypes.Date `json:"date"`
	Description string         `json:"description" validate:"max=2000"`
	Fields      []string       `json:"fields" validate:"required"`
}

func (svc *AuthService) CreateUserPost(ctx *gin.Context) {
	// Get all user registration details and validate user input
	// (confirm that password is certain length, etc...).
	body := models.UserPost{}
	if err := ctx.BindJSON(&body); err != nil {
		fmt.Println(err.Error())
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	body.Date = datatypes.Date(time.Now())
	if err := validatePostDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var result = svc.Handler.Database.Create(&body)
	if result.Error != nil {
		fmt.Println(result.Error)
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"servererror": result.Error.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  body,
	})
}

func (svc *AuthService) ReadUserPost(ctx *gin.Context) {
	body := IdBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}

	var user models.UserPost
	if result := svc.Handler.Database.Where(&models.UserPost{Id: body.Id}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Post with this ID not found"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  user,
	})
}

func (svc *AuthService) UpdateUserPost(ctx *gin.Context) {
	// Bind post body and validate
	body := UserPostUpdateBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	body.Date = datatypes.Date(time.Now())
	if err := validatePutDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get info from userpost based on ID
	var userPost models.UserPost
	if result := svc.Handler.Database.Where(&models.UserPost{Id: body.Id}).First(&userPost); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "Post with this ID not found",
			"servererror": result.Error.Error(),
		})
		return
	}

	fmt.Println(body)
	fmt.Println(body.Fields)
	// Update only the fields specified.
	var result = svc.Handler.Database.Model(&userPost).Select(body.Fields).Updates(&body)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"servererror": result.Error.Error(),
		})
		return
	}
	// Get user data again. This time with updated fields
	svc.Handler.Database.Where(&models.UserPost{Id: body.Id}).First(&userPost)
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  userPost,
	})
}

func (svc *AuthService) RemoveUserPost(ctx *gin.Context) {

}

func (svc *AuthService) GetListUserPost(ctx *gin.Context) {

}

///////////////////////////////
// Helper functions
///////////////////////////////

func validatePostDataFormat(userPost *models.UserPost, svc *AuthService) error {
	validate.RegisterValidation("datetime", IsDatetime)
	err := validate.Struct(userPost)
	if err != nil {
		fmt.Println(err)
	}
	return err
}

func validatePutDataFormat(userPost *UserPostUpdateBody, svc *AuthService) error {
	validate.RegisterValidation("datetime", IsDatetime)
	err := validate.Struct(userPost)
	if err != nil {
		fmt.Println(err)
	}
	return err
}
