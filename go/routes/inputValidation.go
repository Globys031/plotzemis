package routes

import (
	"fmt"

	"github.com/go-playground/validator"
)

// Meant to validate whether the data provided by frontend is of correct format
func ValidateUserDataFormat(user *RegisterRequestBody, svc *AuthService) error {
	validate := validator.New()
	validate.RegisterValidation("role", validateRole)

	fmt.Println(user.Email)

	err := validate.Struct(user)
	if err != nil {
		// this check is only needed when your code could produce
		// an invalid value for validation such as interface with nil
		// value most including myself do not usually have code like this.
		if _, ok := err.(*validator.InvalidValidationError); ok {
			fmt.Println(err)
		}
	}
	return err
}

// Confirm that role is set to one of the three
func validateRole(fl validator.FieldLevel) bool {
	roleName := fl.Field().String()
	return roleName == "USER" || roleName == "MOD" || roleName == "ADMIN"
}
