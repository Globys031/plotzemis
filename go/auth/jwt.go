package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt"

	"github.com/Globys031/plotzemis/go/db/models"
)

type JwtWrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

type JwtClaims struct {
	jwt.StandardClaims
	Id       int64
	Username string
	Role     string // Naudotojo rolė turi būti saugoma žetono (token) viduje.
}

func (wrapper *JwtWrapper) GenerateToken(user models.User) (signedToken string, err error) {
	claims := &JwtClaims{
		Id:       user.UserId,
		Username: user.Username,
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(wrapper.ExpirationHours)).Unix(),
			Issuer:    wrapper.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(wrapper.SecretKey))

	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (wrapper *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaims, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(wrapper.SecretKey), nil
		},
	)

	if err != nil {
		return
	}

	claims, ok := token.Claims.(*JwtClaims)

	if !ok {
		return nil, errors.New("Couldn't parse JWT claims")
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		return nil, errors.New("JWT is expired")
	}

	return claims, nil
}
