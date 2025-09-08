package ml

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Client handles communication with the ML service
type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

// NewClient creates a new ML service client
func NewClient() *Client {
	mlServiceURL := strings.TrimSpace(os.Getenv("ML_SERVICE_URL"))
	if mlServiceURL == "" {
		mlServiceURL = "http://localhost:8000"
	}
	return &Client{
		BaseURL: mlServiceURL,
		HTTPClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// GenerateKolamImage calls the ML service to generate a kolam image and saves it locally
func (c *Client) GenerateKolamImage(gridSize, style string) (string, error) {
	// Prepare request
	reqBody, err := json.Marshal(map[string]string{
		"grid_size": gridSize,
		"style":     style,
	})
	if err != nil {
		return "", fmt.Errorf("marshal request: %w", err)
	}

	// Create request
	req, err := http.NewRequest("POST", strings.TrimRight(c.BaseURL, "/")+"/generate", bytes.NewBuffer(reqBody))
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "image/png")

	// Execute request
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("call ml service: %w", err)
	}
	defer resp.Body.Close()

	// Check response
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("ml service returned status %d: %s", resp.StatusCode, string(body))
	}

	// Determine output directory relative to the backend executable directory
	exePath, err := os.Executable()
	if err != nil {
		// fallback to current working directory
		exePath = "."
	}
	exeDir := filepath.Dir(exePath)
	outputDir := filepath.Join(exeDir, "ml_output")

	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return "", fmt.Errorf("create output dir: %w", err)
	}

	// Create a filename for the image
	timestamp := time.Now().Format("20060102_150405")
	// sanitize inputs
	safeGrid := strings.ReplaceAll(gridSize, " ", "_")
	safeStyle := strings.ReplaceAll(style, " ", "_")
	filename := fmt.Sprintf("kolam_%s_%s_%s.png", safeGrid, safeStyle, timestamp)
	filePath := filepath.Join(outputDir, filename)

	// Create output file
	outFile, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("create file: %w", err)
	}
	defer outFile.Close()

	// Optionally check content-type
	contentType := resp.Header.Get("Content-Type")
	if contentType != "" && !strings.Contains(contentType, "png") {
		// still copy, but warn
		fmt.Fprintf(os.Stderr, "warning: ml service content-type=%s\n", contentType)
	}

	// Copy image data to file
	_, err = io.Copy(outFile, resp.Body)
	if err != nil {
		return "", fmt.Errorf("save image: %w", err)
	}

	return filename, nil
}

// GenerateKolamPNG calls the ML service and returns PNG bytes and a suggested filename (does NOT save to disk)
func (c *Client) GenerateKolamPNG(gridSize, style string) ([]byte, string, error) {
	reqBody, err := json.Marshal(map[string]string{
		"grid_size": gridSize,
		"style":     style,
	})
	if err != nil {
		return nil, "", fmt.Errorf("marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", strings.TrimRight(c.BaseURL, "/")+"/generate", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, "", fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "image/png")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, "", fmt.Errorf("call ml service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, "", fmt.Errorf("ml service returned status %d: %s", resp.StatusCode, string(body))
	}

	ct := resp.Header.Get("Content-Type")
	if ct == "" || !strings.Contains(strings.ToLower(ct), "png") {
		body, _ := io.ReadAll(resp.Body)
		return nil, "", fmt.Errorf("unexpected content-type: %s, body: %s", ct, string(body))
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", fmt.Errorf("read response body: %w", err)
	}

	safeGrid := strings.ReplaceAll(gridSize, " ", "_")
	safeStyle := strings.ReplaceAll(style, " ", "_")
	filename := fmt.Sprintf("kolam_%s_%s_%d.png", safeGrid, safeStyle, time.Now().Unix())

	return data, filename, nil
}

// small helper
func getenv(k, def string) string {
	if v := strings.TrimSpace(strings.Trim(os.Getenv(k), `"`)); v != "" {
		return v
	}
	return def
}
