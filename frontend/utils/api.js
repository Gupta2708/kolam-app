import axios from 'axios';

// Change API_URL if running on device or using Expo tunnel
export const API_URL = 'http://10.0.2.2:8000'; // Android emulator default

export async function generateKolam(grid_size) {
  const res = await axios.post(`${API_URL}/generate`, { grid_size });
  return res.data;
}

export async function classifyKolam(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  const res = await axios.post(`${API_URL}/classify`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
