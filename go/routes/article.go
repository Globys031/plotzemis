package routes

import (
	"github.com/gin-gonic/gin"
)

// Sukurti duomenis apie miesta
type CreateBody struct {
	City     string `json:""`
	District string `json:""`
}

// Will get post based on what ID the GUI returns
type GetBody struct {
	City     string `json:""`
	District string `json:""`
}

type ListGetBody struct {
	City     string `json:""`
	District string `json:""`
}

func (svc *AuthService) Create(ctx *gin.Context) {

}

func (svc *AuthService) Read(ctx *gin.Context) {

}

func (svc *AuthService) Update(ctx *gin.Context) {

}

func (svc *AuthService) Remove(ctx *gin.Context) {

}

func (svc *AuthService) GetList(ctx *gin.Context) {

}
