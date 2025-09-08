package router

import (
	"net/http"

	"github.com/ansh0014/KolamApp/handler"
)

func New() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", handler.HealthHandler)
	mux.HandleFunc("/images/", handler.ImageServeHandler)
	mux.HandleFunc("/upload", handler.ImageUploadHandler)
	mux.HandleFunc("/generate-kolam", handler.GenerateKolamHandler)
	mux.HandleFunc("/proxy", handler.ProxyImageHandler)
	return mux
}
