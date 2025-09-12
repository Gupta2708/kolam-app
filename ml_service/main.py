from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from models.generator_stub import generate_from_grid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KolamRequest(BaseModel):
    grid_size: str = "4"
    style: Optional[str] = "traditional"

@app.post("/generate")
async def generate_kolam(request: KolamRequest):
    try:
        image_bytes = generate_from_grid(request.grid_size, style=request.style)
        return Response(content=image_bytes.getvalue(), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating kolam: {str(e)}")

@app.get("/")
async def root():
    return {"status": "ok", "message": "Kolam ML Service is running"}
