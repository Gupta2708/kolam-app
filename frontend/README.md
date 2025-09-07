# Kolam App Frontend

## Quick Start

1. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
2. Start Expo app:
   ```sh
   npm start
   # or
   expo start
   ```
3. Open in Expo Go app (scan QR) or run on Android/iOS simulator.

## Configure Backend URL
- Edit `frontend/utils/api.js` and set `API_URL` to your backend address.
- Default: `http://10.0.2.2:8000` (Android emulator)
- For physical device: use your computer's LAN IP (e.g., `http://192.168.x.x:8000`)
- For Expo tunnel: use the tunnel URL.

## AR (ViroReact) Setup
- ViroReact requires native build (not supported in Expo Go).
- To use AR:
  1. Eject to bare workflow: `npx expo prebuild`
  2. Install Viro: `npm install viro-react`
  3. Follow [Viro Community setup guide](https://docs.viromedia.com/docs/quick-start)
- Fallback: If Viro not available, AR screen shows camera preview with SVG overlay.
