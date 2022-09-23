package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db/models"
)

type LoginRequestBody struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LogoutRequestBody struct {
}

// use a single instance of Validate, it caches struct info (used for user struct validation)
var validate *validator.Validate = validator.New()

func (svc *AuthService) Register(ctx *gin.Context) {
	// Get all user registration details and validate user input
	// (confirm that password is certain length, etc...).
	body := models.User{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"serverError": err.Error()})
		return
	}
	if err := validateUserDataFormat(&body, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "User data validation didn't succeed on the server side"})
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"serverError": err.Error()})
		return
	}

	//////////////////////
	// needs to be authenticated as an admin to create more admin users
	var adminUser models.User
	if body.Role == "ADMIN" {
		svc.AuthRequiredAdmin(ctx)
		userId, _ := ctx.Get("userId") // Get userId set in middleware
		fmt.Println(userId)
		if userId == nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "You need to be authenticated as an admin to create more admin users"})
			return
		} else {
			resultUserRole := svc.Handler.Database.Where(&models.User{Role: body.Role, UserId: userId.(int64)}).First(&adminUser)
			if resultUserRole.Error != nil {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "You need to be authenticated as an admin to create more admin users"})
				return
			}
		}
	}
	////////////////////

	// Sql check if user with that email already exists and if there's no error from the server
	// Will return nil if there isn't
	var user models.User
	resultEmail := svc.Handler.Database.Where(&models.User{Email: body.Email}).First(&user)
	resultUsername := svc.Handler.Database.Where(&models.User{Username: body.Username}).First(&user)

	if resultEmail.Error == nil && resultUsername.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "Username and E-mail already exists"})
		return
	} else if resultEmail.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "E-Mail already exists"})
		return
	} else if resultUsername.Error == nil {
		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	user.Username = body.Username
	user.Email = body.Email
	user.Password = auth.HashPassword(body.Password)
	user.Role = body.Role

	var result = svc.Handler.Database.Create(&user)
	if result.Error != nil {
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{"error": "Sql server is down or it couldn't process user creation"})
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"serverError": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"userId":   user.UserId,
		"username": user.Username,
		"password": user.Password,
		"email":    user.Email,
		"role":     user.Role,
	})
}

func (svc *AuthService) Login(ctx *gin.Context) {
	body := LoginRequestBody{}
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "incorrect payload format"})
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"serverError": err.Error()})
		return
	}

	var user models.User
	if result := svc.Handler.Database.Where(&models.User{Username: body.Username}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	match := auth.CheckPasswordHash(body.Password, user.Password)
	if !match {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Incorrect password for this username"})
		return
	}

	token, _ := svc.Jwt.GenerateToken(user)
	ctx.JSON(http.StatusOK, gin.H{
		"token":       token,
		"userDetails": user,
	})
}

func (svc *AuthService) Logout(ctx *gin.Context) {
	// Remove token from server side as well
}

///////////////////////////////
// Helper functions
///////////////////////////////

// Meant to validate whether the data provided by frontend is of correct format
func validateUserDataFormat(user *models.User, svc *AuthService) error {
	validate.RegisterValidation("role", validateRole)

	err := validate.Struct(user)
	if err != nil {
		// this check is only needed when your code could produce
		// an invalid value for validation such as interface with nil
		// value most including myself do not usually have code like this.
		if _, ok := err.(*validator.InvalidValidationError); ok {
			fmt.Println(err)
		}
	}
	return err
}

// Confirm that role is set to one of the three
func validateRole(fl validator.FieldLevel) bool {
	roleName := fl.Field().String()
	return roleName == "USER" || roleName == "MOD" || roleName == "ADMIN"
}
