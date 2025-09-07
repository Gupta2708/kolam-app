# Kolam App

A cross-platform prototype to generate, visualize, and explore Kolam designs using AI and AR.

---

## Overview
Kolam (also known as muggu, rangoli, or rangavalli) is a traditional Indian art form based on dot grids and geometric patterns. This app lets users:
- Select a dot grid and generate Kolam patterns (procedurally or via ML in future)
- View and animate Kolam strokes
- Experience Kolam in Augmented Reality (AR) using ViroReact

---

## Architecture
- **Frontend:** React Native (Expo), React Navigation, SVG rendering, ViroReact for AR (with fallback)
- **Backend:** FastAPI, procedural Kolam generator, ML model stub, CORS enabled
- **Communication:** REST API (JSON)

---

## How to Run

### 1. Backend (FastAPI)
- **With Docker Compose:**
  ```sh
  docker-compose up --build
  ```
- **Manual (Python):**
  ```sh
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Test:**
  ```sh
  python backend/test_client.py
  ```

### 2. Frontend (Expo React Native)
- **Install dependencies:**
  ```sh
  cd frontend
  npm install
  ```
- **Start Expo app:**
  ```sh
  npm start
  # or
  expo start
  ```
- **Run on device:**
  - Use Expo Go app (scan QR code)
  - Or run on Android/iOS simulator

---

## AR Setup
- **ViroReact (AR):**
  - ViroReact requires native build (not supported in Expo Go)
  - See [frontend/README.md](frontend/README.md) for Viro install steps
  - Fallback: If Viro not available, AR screen shows camera preview with SVG overlay

---

## API URL Configuration
- **Default:** `http://10.0.2.2:8000` (Android emulator)
- **Change:** Edit `frontend/utils/api.js` → `API_URL`
- For physical device: use your machine's LAN IP (e.g., `http://192.168.x.x:8000`)
- For Expo tunnel: use the tunnel URL

---

## File Structure
- `frontend/` — React Native app
- `backend/` — FastAPI backend
- `backend/models/` — ML model stub
- `backend/static/` — Sample data
- `scripts/` — Dev helper scripts

---

## One-Minute Demo Script
1. **Login:** Enter any email/password, tap Login
2. **Home:** Tap "Generate Kolam"
3. **Kolam Generator:** Select grid (e.g., 1-19-1), tap Generate
4. **View:** See animated Kolam SVG
5. **AR:** Tap "AR View" — see Kolam overlaid in AR (Viro or camera fallback)
6. **(Optional):** Change grid, regenerate, or test on device

---

## Notes
- For AR, ViroReact requires native setup (see frontend/README.md)
- Backend is ready for ML model integration (see backend/models/generator_stub.py)
- All code is commented and ready for rapid prototyping.
