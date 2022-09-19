package auth

import (
	"net/http"
)

// We need to protect the Product and Order Microservice from unauthorized requests.
// That means, on some routes, we only allow logged-in users to address our protected microservices.

type AuthMiddlewareConfig struct {
	s *AuthService
}

func InitAuthMiddleware(s *AuthService) AuthMiddlewareConfig {
	return AuthMiddlewareConfig{s}
}

// !!!!! unfinished function, nepagaunu kaip context ir handleriai cia veikia
func (config *AuthMiddlewareConfig) AuthRequired(ctx context.Context) error {
	authorization := ctx.Request.Header.Get("authorization")

	if authorization[0] == "" || authorization[1] == "" {
		// Authorization header is missing or there's no bearer
		return ctx.AbortWithStatus(http.StatusUnauthorized)
	}

	res, err := c.svc.Client.Validate(context.Background(), &pb.ValidateRequest{
		Token: authorization[1],
	})

	if err != nil || res.Status != http.StatusOK {
		return ctx.AbortWithStatus(http.StatusUnauthorized)
	}

	ctx.Set("userId", res.UserId)

	ctx.Next()

	return nil
}
