import numpy as np
import json
from http import HTTPStatus

def generate_from_grid(grid_size):
    """
    Procedural Kolam generator for grid_size (e.g., '1-19-1').
    Returns dict: {"dots": [[x, y], ...], "strokes": [[[x, y], ...]]}
    Replace this with ML model (e.g., SketchRNN) for real generation.
    To use a PyTorch model:
      import torch
      model = torch.load('models/generator.pth', map_location='cpu')
      # model.eval(); output = model(input)
    """
    if grid_size == '1-19-1':
        N = 19
    elif grid_size == '1-29-1':
        N = 29
    else:
        N = 9  # fallback
    # Create rhombic lattice
    spacing = 1.0
    dots = []
    for i in range(N):
        x = i * spacing
        y = (N//2 - abs(i - N//2)) * spacing
        dots.append([x, y])
    # Center dots
    dots = np.array(dots)
    dots[:, 0] -= np.mean(dots[:, 0])
    dots[:, 1] -= np.mean(dots[:, 1])
    dots = dots.tolist()
    # Generate a symmetric loop path (simple circle around all dots)
    theta = np.linspace(0, 2*np.pi, N*4)
    r = spacing * (N/2)
    path = [[r * np.cos(t), r * np.sin(t)] for t in theta]
    # Return as required
    return {"dots": dots, "strokes": [path]}

# To integrate ML model:
# 1. Load model in this file (see above)
# 2. Replace procedural code with model inference
# 3. Ensure output format: {"dots": [[x, y], ...], "strokes": [[[x, y], ...]]}

# Modify your GenerateKolamHandler to return your existing image for testing
def GenerateKolamHandler(w, r):
    # ... existing code ...
    
    # FOR TESTING ONLY - Return existing image instead of ML-generated one
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode({
        "url": "/images/sticker-png-diwali-floral-india-rangoli-kolam-floral-design-circle.png",
        "id": "test-generated",
        "filename": "sticker-png-diwali-floral-india-rangoli-kolam-floral-design-circle.png",
    })
