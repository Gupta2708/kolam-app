import axios from "axios";

// Adjust the API_URL to point to your Go backend
export const API_URL = 'http://10.0.2.2:8080'; // Update port if different

export const generateKolam = async (gridSize, style) => {
  try {
    const response = await fetch(`${API_URL}/generate-kolam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grid_size: gridSize, style: style }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating kolam:', error);
    throw error;
  }
};

export async function classifyKolam(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);
  const res = await axios.post(`${API_URL}/classify`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export const fetchKolamDesigns = async (gridType) => {
  try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grid_type: gridType }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching kolam designs:', error);
    throw error;
  }
};
