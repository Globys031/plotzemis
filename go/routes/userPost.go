// For user posted house ads

package routes

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	"gorm.io/gorm"

	"github.com/Globys031/plotzemis/go/db/models"
)

// This one doesn't require any field to filled out.
// But we still need to validate that the data provided fits requirements
// Additionally takes an array of fields to know which ones should be updated
type UserPostUpdateBody struct {
	Id          int64          `json:"id"` // post ID
	UserId      int64          `json:"userId"`
	City        string         `json:"city" validate:"max=20"`
	District    string         `json:"district" validate:"max=40"`
	AreaSize    int64          `json:"areaSize" validate:"gt=1,lt=999999"` // square meters
	Price       int64          `json:"price" validate:"gt=1,lt=999999999"` // euros
	RoomCount   int64          `json:"roomCount" validate:"gt=1,lt=999"`
	Date        datatypes.Date `json:"date"`
	Description string         `json:"description" validate:"max=2000"`
	Fields      []string       `json:"fields" validate:"required"`
}

type UserPostReadAllBody struct {
	// If any of the int values is = 0, that means "unlimited" (match any)
	// Additionally, if int values aren't specified they'll just
	// default to 0. Effectively meaning the same thing.

	// If city or district is = "" that also means match any city or district
	City           string `json:"city"`
	District       string `json:"district"`
	AreaSizeLower  int64  `json:"areaSizeLower"` // square meters
	AreaSizeUpper  int64  `json:"areaSizeUpper"` // square meters
	PriceLower     int64  `json:"priceLower"`    // euros
	PriceUpper     int64  `json:"priceUpper"`    // euros
	RoomCountLower int64  `json:"roomCountLower"`
	RoomCountUpper int64  `json:"roomCountUpper"`
}

func (svc *AuthService) CreateUserPost(ctx *gin.Context) {
	// jsonData, _ := ioutil.ReadAll(ctx.Request.Body)
	// fmt.Println(string(jsonData))
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
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	fmt.Println(body)

	// Get info from userpost based on ID
	var userPost models.UserPost
	if result := svc.Handler.Database.Where(&models.UserPost{Id: body.Id, UserId: userId.(int64)}).First(&userPost); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error":       "Post with this ID not found or your userId doesn't match that of the post's creator",
			"serverError": result.Error.Error(),
		})
		return
	}
	//////////////////////
	// Needed for proper validation
	if body.AreaSize == 0 {
		body.AreaSize = userPost.AreaSize
	}
	if body.Price == 0 {
		body.Price = userPost.Price
	}
	if body.RoomCount == 0 {
		body.RoomCount = userPost.RoomCount
	}
	if body.Description == "" {
		body.Description = userPost.Description
	}
	if body.City == "" {
		body.City = userPost.City
	}
	if body.District == "" {
		body.District = userPost.District
	}
	////////////

	if err := validatePutDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only the fields specified.
	var result = svc.Handler.Database.Model(&userPost).Select(body.Fields).Updates(&body)
	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"error":       "Sql server is down or it couldn't process user creation",
			"serverError": result.Error.Error(),
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
	body := IdBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		return
	}
	userId, _ := ctx.Get("userId") // Get userId set in middleware

	// Removes record based on post Id
	if result := svc.Handler.Database.Delete(&models.UserPost{}, body.Id, userId.(int64)); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Post with this ID not found  or your userId doesn't match that of the post's creator"})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  "Post removed",
	})
}

func (svc *AuthService) ReadListUserPost(ctx *gin.Context) {
	body := UserPostReadAllBody{}
	var result *gorm.DB
	var userPosts []models.UserPost

	// If no payload is given, return all posts
	if ctx.Request.ContentLength == 0 {
		result = svc.Handler.Database.Find(&userPosts)
		// else check the optional json parameters
	} else {
		if err := ctx.BindJSON(&body); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
			return
		}
		// If value is set to "0" that means unlimited
		// in which case, set them to the max and min available values
		// as declared by UserPostUpdateBody data validation
		if body.AreaSizeLower == 0 {
			body.AreaSizeLower = 1
		}
		if body.AreaSizeUpper == 0 {
			body.AreaSizeUpper = 999999
		}
		if body.PriceLower == 0 {
			body.PriceLower = 1
		}
		if body.PriceUpper == 0 {
			body.PriceUpper = 999999999
		}
		if body.RoomCountLower == 0 {
			body.RoomCountLower = 1
		}
		if body.RoomCountUpper == 0 {
			body.RoomCountUpper = 999
		}
		// If no city or district name if set, also match any
		if body.City == "" {
			body.City = "%"
		}
		if body.District == "" {
			body.District = "%"
		}

		// Else get all matched records
		// https://gorm.io/docs/query.html
		result = svc.Handler.Database.Where(
			"city LIKE ? "+
				"AND district LIKE ? "+
				"AND area_size >= ? AND area_size <= ? "+
				"AND price >= ? AND price <= ? "+
				"AND room_count >= ? AND room_count <= ?",
			body.City,
			body.District,
			body.AreaSizeLower, body.AreaSizeUpper,
			body.PriceLower, body.PriceUpper,
			body.RoomCountLower, body.RoomCountUpper,
		).Find(&userPosts)
	}

	if result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"success": "true",
		"result":  userPosts,
	})
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
