package handler

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	
	"github.com/ansh0014/KolamApp/model"
	"github.com/ansh0014/KolamApp/service"
)

const storageDir = "ml_output"

// Health handler
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]string{"status": "ok", "service": "kolam-backend-prototype"})
}

// Serve images from storageDir
func ImageServeHandler(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimPrefix(r.URL.Path, "/images/")
	if name == "" {
		http.Error(w, "image name required", http.StatusBadRequest)
		return
	}
	if strings.Contains(name, "..") || strings.ContainsRune(name, os.PathSeparator) {
		http.Error(w, "invalid filename", http.StatusBadRequest)
		return
	}
	p := filepath.Join(storageDir, filepath.Clean(name))
	if _, err := os.Stat(p); os.IsNotExist(err) {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	http.ServeFile(w, r, p)
}

// Upload handler: saves file and stores metadata in MongoDB
// expects multipart form field "file"
func ImageUploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "failed parse multipart: "+err.Error(), http.StatusBadRequest)
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "missing file form field 'file': "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	if err := os.MkdirAll(storageDir, 0755); err != nil {
		http.Error(w, "failed create storage: "+err.Error(), http.StatusInternalServerError)
		return
	}

	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".png"
	}
	filename := time.Now().UTC().Format("20060102T150405Z") + "_" + header.Filename
	dstPath := filepath.Join(storageDir, filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		http.Error(w, "failed to save file: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "failed write file: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// store metadata
	img := &model.Image{
		Filename: filename,
		URL:      "/images/" + filename,
	}
	id, err := service.SaveImageMeta(img)
	if err != nil {
		log.Printf("warning: failed save metadata: %v", err)
		// proceed but return warning
		writeJSON(w, map[string]interface{}{"url": img.URL, "warning": "metadata save failed"})
		return
	}

	writeJSON(w, map[string]interface{}{"url": img.URL, "id": id})
}



func writeJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}
