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
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowHeaders = []string{"authorization", "Origin", "Content-Length", "Content-Type"}
	router.Use(cors.New(config)) // Default() allows all CORS origins,
	// Considering this application will have to be uploaded to the cloud,
	// for simplicity's sake, I'll allow any origin to access the resource

	// Each route function decides where to use authentication middleware (if resource should be protected)
	// inside the function itself
	// Doesn't need authentication
	routesGuest := router.Group("/api")
	routesGuest.POST("/register", svc.Register)
	routesGuest.POST("/login", svc.Login)

	// Needs regular user authentication
	routesUser := router.Group("/api/user")
	routesUser.Use(svc.AuthRequiredUser)
	routesUser.POST("/logout", svc.Logout)
	routesUser.POST("/userpost", svc.CreateUserPost)
	routesUser.GET("/userpost", svc.ReadUserPost)
	routesUser.GET("/userpost/all", svc.ReadListUserPost)
	routesUser.PUT("/userpost", svc.UpdateUserPost)
	routesUser.POST("/userpost/remove", svc.RemoveUserPost)

	// // Needs admin level authentication
	// routesAdmin := router.Group("/api/admin")
	// routesUser.Use(svc.AuthRequiredAdmin)

	return router
}
