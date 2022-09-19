package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	auth "github.com/Globys031/plotzemis/go/auth"
)

// Wrapper function for adding security measures
func HandlerWrapper(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("got " + r.URL.Path + " " + r.Method + " request\n")

		// ValidateToken function goes here

		// Considering this application will have to be uploaded to the cloud,
		// for simplicity's sake, I'll allow any origin to access the resource
		(*w).Header().Set("Access-Control-Allow-Origin", "*")

		fn(w, r, globalID, topics, topic)
	}
}

// Handles GET requests to
func GETHandler(w http.ResponseWriter, r *http.Request) {
	// Go already handles HTTP internally with go routines so no need for another goroutine

}

// Handles POST requests to
func POSTHandler(w http.ResponseWriter, r *http.Request) {

}