package routes

import (
	"net/http"
	"strings"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db/models"
	"github.com/gin-gonic/gin"
)

//  middleware functions only take one argument *gin.Context

// Middleware for checking token
func (svc *AuthService) AuthRequired(ctx *gin.Context) *auth.JwtClaims {
	////////////////////////////////////
	// Checks if authorization token is present
	authorization := ctx.Request.Header.Get("authorization")
	if authorization == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": " Authorization header is missing or there's no bearer"})
		return nil
	}
	token := strings.Split(authorization, "Bearer ")
	if len(token) < 2 {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": " Authorization header is missing or there's no bearer"})
		return nil
	}

	////////////////////////////////////
	// Confirm user access level (checks role in token)
	claims, err := svc.Jwt.ValidateToken(token[1])
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to validate token"})
		return nil
	}
	return claims
}

func (svc *AuthService) AuthRequiredUser(ctx *gin.Context) {
	claims := svc.AuthRequired(ctx)

	var user models.User
	// Validate based on whether the name in token
	// and access role in validateRequest matches an entry in database
	if result := svc.Handler.Database.Where(&models.User{Username: claims.Username, Role: claims.Role}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"UserId": user.UserId,
	})

	ctx.Set("userId", user.UserId)
	ctx.Next() // executes the pending handlers in the chain inside the calling handler.
}

func (svc *AuthService) AuthRequiredAdmin(ctx *gin.Context) {
	claims := svc.AuthRequired(ctx)

	var user models.User

	if result := svc.Handler.Database.Where(&models.User{Username: claims.Username, Role: "ADMIN"}).First(&user); result.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User with this name and admin privileges not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"UserId": user.UserId,
	})

	ctx.Set("userId", user.UserId)
	ctx.Next() // executes the pending handlers in the chain inside the calling handler.
}
