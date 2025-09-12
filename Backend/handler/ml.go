package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/ansh0014/KolamApp/config"
	"github.com/ansh0014/KolamApp/ml"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// Client handles communication with the ML service
type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

// NewClient creates a new ML service client
func NewClient() *Client {
	mlServiceURL := os.Getenv("ML_SERVICE_URL")
	if mlServiceURL == "" {
		mlServiceURL = "http://localhost:8000" // Default URL for local development
	}

	return &Client{
		BaseURL: mlServiceURL,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GenerateKolamRequest represents the request to generate a kolam
type GenerateKolamRequest struct {
	GridSize string `json:"grid_size"`
}

// GenerateKolam calls the ML service to generate a kolam pattern
func (c *Client) GenerateKolam(gridSize string) (map[string]interface{}, error) {
	reqBody := GenerateKolamRequest{
		GridSize: gridSize,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create request to ML service
	req, err := http.NewRequest("POST", fmt.Sprintf("%s/generate", c.BaseURL), bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call ML service: %w", err)
	}
	defer resp.Body.Close()

	// Check response
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("ML service error (status %d): %s", resp.StatusCode, string(body))
	}

	// Parse response
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return result, nil
}

// GenerateKolamHandler -> POST /generate-kolam
// Uploads generated PNG to Cloudinary and returns { url, public_id, filename }.
// Does NOT save to MongoDB or local disk.
func GenerateKolamHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		GridSize string `json:"grid_size"`
		Style    string `json:"style"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.GridSize == "" {
		req.GridSize = "1-19-1"
	}
	if req.Style == "" {
		req.Style = "traditional"
	}

	// get PNG bytes from ML service
	mlClient := ml.NewClient()
	imgBytes, filename, err := mlClient.GenerateKolamPNG(req.GridSize, req.Style)
	if err != nil {
		http.Error(w, "ml generate failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Init Cloudinary using config (call config.InitCloudinaryConfig() in main.go on startup)
	var cld *cloudinary.Cloudinary
	if config.CloudinaryURL != "" {
		cld, err = cloudinary.NewFromURL(config.CloudinaryURL)
	} else {
		cld, err = cloudinary.NewFromParams(config.CloudinaryCloudName, config.CloudinaryAPIKey, config.CloudinaryAPISecret)
	}
	if err != nil {
		http.Error(w, "cloudinary init failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// build publicID without file extension
	baseName := strings.TrimSuffix(filename, filepath.Ext(filename)) // removes ".png"
	publicID := "kolam/" + baseName
	overwrite := false
	uploadParams := uploader.UploadParams{
		PublicID:  publicID,
		Folder:    "kolam",
		Overwrite: &overwrite,
	}

	uploadResp, err := cld.Upload.Upload(ctx, bytes.NewReader(imgBytes), uploadParams)
	if err != nil {
		http.Error(w, "cloudinary upload failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// verify upload response
	if uploadResp.SecureURL == "" || uploadResp.PublicID == "" {
		http.Error(w, "cloudinary upload did not return URL/public_id", http.StatusInternalServerError)
		return
	}

	// log result for debugging
	log.Printf("Cloudinary uploaded: public_id=%s secure_url=%s", uploadResp.PublicID, uploadResp.SecureURL)

	// return Cloudinary info only
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"url":       uploadResp.SecureURL,
		"public_id": uploadResp.PublicID,
		"filename":  filename,
	})
}

// MLServiceHealthCheckHandler -> GET /ml-health
// Checks the health of the ML service
func MLServiceHealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	mlClient := ml.NewClient()

	// Try to connect to the ML service
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/health", mlClient.BaseURL), nil)
	if err != nil {
		http.Error(w, "Failed to create request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := mlClient.HTTPClient.Do(req)
	if err != nil {
		http.Error(w, "ML service is not reachable: "+err.Error(), http.StatusServiceUnavailable)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, fmt.Sprintf("ML service returned non-OK status: %d", resp.StatusCode), http.StatusServiceUnavailable)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ML service is connected and healthy",
	})
}
