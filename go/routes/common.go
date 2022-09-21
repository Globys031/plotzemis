// This is where all the functions and structs commonly used by routes go

package routes

import (
	"fmt"
	"reflect"
	"time"

	"github.com/go-playground/validator"
)

type IdBody struct {
	Id int64 `json:"id"`
}

const (
	// https://yourbasic.org/golang/format-parse-string-time-date-example/
	layoutISO = "2006-01-02" // The european datetime layout
	layoutUS  = "January 2, 2006"
)

// https://github.com/go-playground/validator/commit/c68441b7f4748b48ad9a0c9a79d346019730e207#diff-6eda4809e29e9c01c780a30c46947d23b10606dbd948fd00dc5376030cf897c6R2077
// isDatetime is the validation function for validating
// if the current field's value is a valid datetime string.
func IsDatetime(fl validator.FieldLevel) bool {
	field := fl.Field()

	if field.Kind() == reflect.String {
		// returns something like "1999-12-31 00:00:00 +0000 UTC"
		_, err := time.Parse(layoutISO, field.String())
		if err != nil {
			return false
		}

		return true
	}

	panic(fmt.Sprintf("Bad field type %T", field.Interface()))
}
