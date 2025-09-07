from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from models.generator_stub import generate_from_grid

app = FastAPI()

# Enable CORS for all origins (for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    grid_size: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
def generate_kolam(req: GenerateRequest):
    # Use procedural generator or ML model (see models/generator_stub.py)
    result = generate_from_grid(req.grid_size)
    return result

@app.post("/classify")
def classify_kolam(file: UploadFile = File(...)):
    # Stub: Replace with ML model inference
    return {"result": "stub-classification", "filename": file.filename}
