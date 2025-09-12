import re
import matplotlib.pyplot as plt
import random
import math
import os
import requests
from io import BytesIO

# ------------------ DOWNLOAD KOLAM DATA ------------------
DATA_URL = "https://raw.githubusercontent.com/Crazzygamerr/zen-kolam/a1c1facf8b39987db7c79346fd9bf8d7be66c6e3/scripts/kolam_data_numerical.txt"
DATA_FILE = os.path.join(os.path.dirname(__file__), "kolam_data_numerical.txt")

# Ensure file exists
if not os.path.exists(DATA_FILE):
    resp = requests.get(DATA_URL)
    with open(DATA_FILE, "wb") as f:
        f.write(resp.content)

# ------------------ PARSING FUNCTION ------------------
def parse_kolam_data(file_path):
    patterns = []
    current_pattern = None
    current_points = []

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.read().split("\n")

    for line in lines:
        line = line.strip()
        if line.startswith("--- Pattern"):
            if current_pattern and current_points:
                patterns.append({"id": current_pattern["id"], "points": current_points.copy()})

            match = re.match(r"--- Pattern (\d+) ---", line)
            if match:
                current_pattern = {"id": int(match.group(1))}
                current_points = []

        elif "Point" in line and "x=" in line:
            match = re.search(r"\(x=([-\d\.]+),\s*y=([-\d\.]+)\)", line)
            if match:
                current_points.append((float(match.group(1)), float(match.group(2))))

    if current_pattern and current_points:
        patterns.append({"id": current_pattern["id"], "points": current_points.copy()})

    return patterns

# ------------------ GRID LAYOUT ------------------
def generate_grid_layout(grid_size, id_to_pattern, allowed_top_left):
    grid = [[None] * grid_size for _ in range(grid_size)]
    half_size = grid_size // 2

    # Fill top-left quadrant
    for r in range(half_size):
        for c in range(half_size):
            if r == 0 and c == 0:
                chosen_id = random.choice(allowed_top_left)
                grid[r][c] = id_to_pattern[chosen_id]
            else:
                grid[r][c] = random.choice(list(id_to_pattern.values()))

    # Mirror horizontally
    for r in range(half_size):
        for c in range(half_size, grid_size):
            source_c = (half_size - 1) - (c - half_size)
            grid[r][c] = grid[r][source_c]

    # Mirror vertically
    for r in range(half_size, grid_size):
        for c in range(grid_size):
            source_r = (half_size - 1) - (r - half_size)
            grid[r][c] = grid[source_r][c]

    return grid

# ------------------ IMAGE GENERATOR ------------------
def generate_from_grid(grid_size_str: str, style="traditional"):
    try:
        n = int(grid_size_str)
    except:
        n = 4
    if n % 2 != 0:
        n -= 1
    n = max(2, min(n, 20))

    patterns = parse_kolam_data(DATA_FILE)
    if not patterns:
        raise RuntimeError("No kolam patterns loaded")

    allowed_top_left = [1, 3, 6, 12, 13, 16]
    id_to_pattern = {p["id"]: p for p in patterns}
    grid_patterns = generate_grid_layout(n, id_to_pattern, allowed_top_left)
    half_size = n // 2

    fig, ax = plt.subplots(figsize=(n, n))
    ax.set_aspect("equal")
    ax.axis("off")

    # global scaling
    min_x = min(pt[0] for p in patterns for pt in p["points"])
    max_x = max(pt[0] for p in patterns for pt in p["points"])
    min_y = min(pt[1] for p in patterns for pt in p["points"])
    max_y = max(pt[1] for p in patterns for pt in p["points"])
    scale = 1.0 / max(max_x - min_x, max_y - min_y, 1)

    # 45° rotation constants
    angle = math.radians(45)
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    cx = (n * 1.0) / 2
    cy = (n * 1.0) / 2

    for row in range(n):
        for col in range(n):
            pattern = grid_patterns[row][col]
            if not pattern:
                continue

            transformed_points = []
            for x, y in pattern["points"]:
                x_scaled = (x - min_x) * scale
                y_scaled = (y - min_y) * scale

                if row >= half_size:
                    y_scaled = 1.0 - y_scaled
                if col >= half_size:
                    x_scaled = 1.0 - x_scaled

                final_x = x_scaled + col * 1.0
                final_y = y_scaled + (n - 1 - row) * 1.0

                dx = final_x - cx
                dy = final_y - cy
                rot_x = cx + dx * cos_a - dy * sin_a
                rot_y = cy + dx * sin_a + dy * cos_a
                transformed_points.append((rot_x, rot_y))

            if transformed_points:
                xs, ys = zip(*transformed_points)
                ax.plot(xs, ys, color="black", linewidth=6)

            # dot
            center_x = col * 1.0 + 0.5
            center_y = (n - 1 - row) * 1.0 + 0.5
            dx = center_x - cx
            dy = center_y - cy
            rot_cx = cx + dx * cos_a - dy * sin_a
            rot_cy = cy + dx * sin_a + dy * cos_a
            ax.plot(rot_cx, rot_cy, "ko", markersize=2)

    diag = math.sqrt(2) * n * 1.0 / 2
    ax.set_xlim(cx - diag, cx + diag)
    ax.set_ylim(cy - diag, cy + diag)
    plt.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", pad_inches=0.1, dpi=300)
    plt.close()
    buf.seek(0)
    return buf
