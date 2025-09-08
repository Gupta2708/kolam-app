import requests
import sys
from PIL import Image
from io import BytesIO
import os

BACKEND_UPLOAD_URL = os.getenv("BACKEND_UPLOAD_URL", "http://localhost:8080/upload")  # change if different

def test_generate_and_forward(grid_size="1-19-1", style="traditional"):
    ml_url = "http://localhost:8000/generate"
    payload = {"grid_size": grid_size, "style": style}

    try:
        print(f"Requesting kolam from ML: grid_size={grid_size}, style={style}")
        ml_resp = requests.post(ml_url, json=payload, timeout=60)
        if ml_resp.status_code != 200:
            print("ML service error:", ml_resp.status_code, ml_resp.text)
            return None

        # Verify we received an image
        try:
            img = Image.open(BytesIO(ml_resp.content))
            img.verify()  # raises if not a valid image
        except Exception as e:
            print("Response is not a valid image:", e)
            return None

        # Forward as multipart/form-data to backend upload endpoint
        files = {
            "file": (f"kolam_{grid_size}_{style}.png", ml_resp.content, "image/png"),
        }
        upload_resp = requests.post(BACKEND_UPLOAD_URL, files=files, timeout=60)

        if upload_resp.status_code in (200, 201):
            print("Backend upload success:", upload_resp.status_code)
            return upload_resp
        else:
            print("Backend upload failed:", upload_resp.status_code, upload_resp.text)
            return None

    except Exception as e:
        print("Exception:", e)
        return None

if __name__ == "__main__":
    grid_size = sys.argv[1] if len(sys.argv) > 1 else "1-19-1"
    style = sys.argv[2] if len(sys.argv) > 2 else "traditional"
    test_generate_and_forward(grid_size, style)
