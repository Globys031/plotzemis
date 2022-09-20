package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db/models"
)

// use a single instance of Validate, it caches struct info (used for user struct validation)
var validate *validator.Validate

func (svc *AuthService) Register(ctx *gin.Context) {
	var user models.User

	// Sql check if user with that email already exists and if there's no error from the server
	// Will return nil if there isn't
	resultEmail := svc.Handler.Database.Where(&models.User{Email: ctx.Param("Email")}).First(&user)
	resultUsername := svc.Handler.Database.Where(&models.User{Username: ctx.Param("Username")}).First(&user)

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

	// Get all user registration details and validate user input
	// (confirm that password is certain length, etc...).
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ValidateUserDataFormat(&user, svc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "User data validation didn't succeed on the server side"})
		return
	}
	// Password hashes only after validation. Otherwise, wouldn't be able
	// to properly check what length the string is
	user.Password = auth.HashPassword(user.Password)

	var result = svc.Handler.Database.Create(&user)
	if result.Error != nil {
		// Possible situation where postgre server was initially up, but later crashed
		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{"error": "Sql server is down or it couldn't process user creation"})
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
	var user models.User

	if result := svc.Handler.Database.Where(&models.User{Username: ctx.Param("Username")}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	match := auth.CheckPasswordHash(ctx.Param("Password"), user.Password)
	if !match {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Incorrect password for this username"})
		return
	}

	token, _ := svc.Jwt.GenerateToken(user)
	fmt.Println(token)
	ctx.JSON(http.StatusOK, gin.H{
		"token":       token,
		"userDetails": user,
	})
}

func (svc *AuthService) Logout(ctx *gin.Context) {
	// Remove token from server side as well
}
