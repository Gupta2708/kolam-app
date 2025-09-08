package handler

import (
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// GET /proxy?u=<url-encoded-cloudinary-url>
func ProxyImageHandler(w http.ResponseWriter, r *http.Request) {
	u := r.URL.Query().Get("u")
	if u == "" {
		http.Error(w, "missing u param", http.StatusBadRequest)
		return
	}
	parsed, err := url.Parse(u)
	if err != nil || parsed.Host == "" {
		http.Error(w, "invalid url", http.StatusBadRequest)
		return
	}
	if !strings.Contains(parsed.Host, "res.cloudinary.com") {
		http.Error(w, "only cloudinary host allowed", http.StatusForbidden)
		return
	}

	client := &http.Client{Timeout: 20 * time.Second}
	resp, err := client.Get(u)
	if err != nil {
		http.Error(w, "fetch failed: "+err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.Header().Set("Cache-Control", "public, max-age=3600")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
