// All routes are registered here

package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/Globys031/plotzemis/go/auth"
	"github.com/Globys031/plotzemis/go/db"
)

type AuthService struct {
	Handler db.Handler
	Jwt     auth.JwtWrapper
}

func RegisterRoutes(svc *AuthService) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default()) // Default() allows all CORS origins,
	// Considering this application will have to be uploaded to the cloud,
	// for simplicity's sake, I'll allow any origin to access the resource

	// Each route function decides where to use authentication middleware (if resource should be protected)
	// inside the function itself
	// Doesn't need authentication
	routesGuest := router.Group("/auth")
	routesGuest.POST("/register", svc.Register)
	routesGuest.POST("/login", svc.Login)

	// Needs regular user authentication
	routesUser := router.Group("/user")
	routesUser.Use(svc.AuthRequiredUser)
	routesUser.POST("/logout", svc.Logout)

	// // Needs admin level authentication
	// routesAdmin := router.Group("/admin")
	// routesUser.Use(svc.AuthRequiredAdmin)

	return router
}