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

	routesGuest.GET("/userpost", svc.ReadUserPost)
	routesGuest.GET("/userpost/all", svc.ReadListUserPost)

	routesGuest.GET("/building", svc.ReadBuilding)
	routesGuest.GET("/building/all", svc.ReadListBuilding)

	routesGuest.GET("/street", svc.ReadStreet)
	routesGuest.GET("/street/all", svc.ReadListStreet)

	routesGuest.GET("/plot", svc.ReadPlot)
	routesGuest.GET("/plot/all", svc.ReadListPlot)

	// Needs regular user authentication
	routesUser := router.Group("/api/user")
	routesUser.Use(svc.AuthRequiredUser)
	routesUser.POST("/logout", svc.Logout)

	routesUser.POST("/userpost", svc.CreateUserPost)
	routesUser.PUT("/userpost", svc.UpdateUserPost)
	routesUser.POST("/userpost/remove", svc.RemoveUserPost)

	routesUser.POST("/building", svc.CreateBuilding)
	routesUser.PUT("/building", svc.UpdateBuilding)
	routesUser.POST("/building/remove", svc.RemoveBuilding)

	routesUser.POST("/street", svc.CreateStreet)
	routesUser.PUT("/street", svc.UpdateStreet)
	routesUser.POST("/street/remove", svc.RemoveStreet)

	routesUser.POST("/plot", svc.CreatePlot)
	routesUser.PUT("/plot", svc.UpdatePlot)
	routesUser.POST("/plot/remove", svc.RemovePlot)

	// Needs admin level authentication
	routesAdmin := router.Group("/api/admin")
	routesAdmin.Use(svc.AuthRequiredAdmin)
	routesAdmin.POST("/userpost/remove", svc.RemoveUserPostAdmin)
	routesAdmin.POST("/building/remove", svc.RemoveBuildingAdmin)
	routesAdmin.POST("/plot/remove", svc.RemovePlotAdmin)
	routesAdmin.POST("/street/remove", svc.RemoveStreetAdmin)

	return router
}
