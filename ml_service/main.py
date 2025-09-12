from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from models.generator_stub import generate_from_grid
from io import BytesIO
import matplotlib.pyplot as plt
import numpy as np

app = FastAPI()

# Enable CORS for all origins (for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KolamRequest(BaseModel):
    grid_size: str = "1-19-1"
    style: Optional[str] = "traditional"
    
@app.post("/generate")
async def generate_kolam(request: KolamRequest):
    try:
        # Generate kolam data using the stub
        kolam_data = generate_from_grid(request.grid_size)
        
        # Convert the data to a PNG image
        image_bytes = generate_kolam_image(kolam_data, style=request.style)
        
        # Return the image
        return Response(
            content=image_bytes.getvalue(),
            media_type="image/png"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating kolam: {str(e)}")

def generate_kolam_image(kolam_data, style="traditional"):
    """Generate a PNG image from kolam data"""
    # Create a new figure
    plt.figure(figsize=(10, 10), dpi=100)
    plt.axis('equal')
    plt.axis('off')  # Hide axes
    
    # Set background color
    plt.gca().set_facecolor('white')
    
    # Extract dots and strokes
    dots = np.array(kolam_data["dots"])
    strokes = kolam_data["strokes"]
    
    # Set style-specific parameters
    if style == "traditional":
        dot_color = 'black'
        stroke_color = 'black'
        dot_size = 20
        line_width = 1.5
    elif style == "modern":
        dot_color = '#1a237e'  # Dark blue
        stroke_color = '#303f9f'  # Indigo
        dot_size = 15
        line_width = 2.0
    elif style == "festive":
        dot_color = '#b71c1c'  # Dark red
        stroke_color = '#c62828'  # Red
        dot_size = 25
        line_width = 2.5
    else:
        dot_color = 'black'
        stroke_color = 'black'
        dot_size = 20
        line_width = 1.5
    
    # Draw dots
    if len(dots) > 0:
        plt.scatter(dots[:, 0], dots[:, 1], color=dot_color, s=dot_size, zorder=2)
    
    # Draw strokes
    for stroke in strokes:
        stroke_array = np.array(stroke)
        plt.plot(stroke_array[:, 0], stroke_array[:, 1], 
                 color=stroke_color, linewidth=line_width, zorder=1)
    
    # Save to BytesIO
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, dpi=300)
    plt.close()
    
    # Reset buffer position to start
    buf.seek(0)
    
    return buf

@app.get("/")
async def root():
    return {"status": "ok", "message": "Kolam ML Service is running"}

