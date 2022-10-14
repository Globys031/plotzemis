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

	// Had to get rid of middleware and instead will have to call it manually now.
	routes := router.Group("/api")
	routes.POST("/register", svc.Register) // No auth
	routes.POST("/login", svc.Login)       // No auth
	routes.POST("/logout", svc.Logout)     // Yes auth

	routes.GET("/street/", svc.ReadListStreet)           // No auth (Get all streets)
	routes.GET("/street/:streetID", svc.ReadStreet)      // No auth
	routes.POST("/street", svc.CreateStreet)             // Yes auth
	routes.PUT("/street/:streetID", svc.UpdateStreet)    // Yes auth
	routes.DELETE("/street/:streetID", svc.RemoveStreet) // Yes auth + special use if admin

	routes.GET("/street/:streetID/", svc.ReadListPlot)         // No auth   (Get all plots in that street)
	routes.GET("/street/:streetID/:plotID", svc.ReadPlot)      // No auth
	routes.POST("/street/:streetID", svc.CreatePlot)           // Yes auth
	routes.PUT("/street/:streetID/:plotID", svc.UpdatePlot)    // Yes auth
	routes.DELETE("/street/:streetID/:plotID", svc.RemovePlot) // Yes auth + special use if admin

	routes.GET("/street/:streetID/:plotID/", svc.ReadListBuilding)             // No auth
	routes.GET("/street/:streetID/:plotID/:buildingID", svc.ReadBuilding)      // No auth
	routes.POST("/street/:streetID/:plotID", svc.CreateBuilding)               // Yes auth
	routes.PUT("/street/:streetID/:plotID/:buildingID", svc.UpdateBuilding)    // Yes auth
	routes.DELETE("/street/:streetID/:plotID/:buildingID", svc.RemoveBuilding) // Yes auth + special use if admin

	return router
}
