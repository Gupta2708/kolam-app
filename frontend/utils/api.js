import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://10.0.2.2:8080";

export async function generateKolam(gridSize = "1-19-1", style = "traditional") {
  const res = await fetch(`${API_BASE}/generate-kolam`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grid_size: gridSize, style }),
  });

  const text = await res.text();
  console.log("backend raw response text:", text);

  if (!res.ok) {
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Invalid JSON from server: " + e.message);
  }
}

export async function classifyKolam(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);
  const res = await axios.post(`${API_BASE}/classify`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
