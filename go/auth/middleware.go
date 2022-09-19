package auth

import (
	"net/http"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"

	library "github.com/Globys031/grpc-web-video-streaming/authServer/go/protoLibrary"
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
	md, _ := metadata.FromIncomingContext(ctx)
	authorization := md.Get("authorization")

	if authorization[0] == "" || authorization[1] == "" {
		return grpc.Errorf(codes.Unauthenticated, "Authorization header is missing or there's no bearer")
	}

	res, err := config.s.Validate(context.Background(), &library.ValidateRequest{
		Token: authorization[1],
	})

	if err != nil || res.Status != http.StatusOK {
		return grpc.Errorf(codes.Internal, "Server returned token was invalid")
	}
	return nil

	// ctx.Set("userId", res.UserId)

	// ctx.Next()
}
