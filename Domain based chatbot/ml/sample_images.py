"""Generate sample test images for waste classification demo."""

import io
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


SAMPLE_DATA = [
    ("organic", (80, 150, 70), "🍎 Organic"),
    ("recyclable", (100, 120, 140), "📄 Recyclable"),
    ("plastic", (50, 130, 220), "🧴 Plastic"),
    ("metal", (180, 180, 185), "🥫 Metal"),
    ("ewaste", (60, 60, 70), "💻 E-Waste"),
    ("hazardous", (200, 50, 50), "☢️ Hazardous"),
    ("mixed", (120, 110, 100), "🗑️ Mixed"),
]


def create_sample_image(color, label, size=(224, 224)):
    """Create a colored sample image with text label."""
    img_array = np.full((*size, 3), color, dtype=np.uint8)
    
    noise = np.random.randint(-20, 20, size=(*size, 3), dtype=np.int16)
    img_array = np.clip(img_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(img_array)
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except (OSError, IOError):
        font = ImageFont.load_default()
    
    text_bbox = draw.textbbox((0, 0), label, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    draw.rectangle(
        [(x - 10, y - 5), (x + text_width + 10, y + text_height + 5)],
        fill=(0, 0, 0, 128)
    )
    draw.text((x, y), label, fill=(255, 255, 255), font=font)
    
    return img


def save_sample_images(output_dir=None):
    """Generate and save sample images for each waste category."""
    if output_dir is None:
        output_dir = Path(__file__).parent / "samples"
    else:
        output_dir = Path(output_dir)
    
    output_dir.mkdir(exist_ok=True)
    
    print(f"Generating sample images in: {output_dir}")
    
    for filename, color, label in SAMPLE_DATA:
        img = create_sample_image(color, label)
        filepath = output_dir / f"{filename}.png"
        img.save(filepath)
        print(f"  ✓ Created: {filepath.name}")
    
    print(f"\n✅ Generated {len(SAMPLE_DATA)} sample images")
    return output_dir


def get_sample_bytes(category_name):
    """Get sample image as bytes for in-memory testing."""
    for filename, color, label in SAMPLE_DATA:
        if filename == category_name.lower():
            img = create_sample_image(color, label)
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            return buffer.getvalue()
    
    raise ValueError(f"Unknown category: {category_name}")


if __name__ == "__main__":
    save_sample_images()
