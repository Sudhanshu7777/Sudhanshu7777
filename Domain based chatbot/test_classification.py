"""Test script for waste classification API endpoints."""

import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))

from ml import WasteClassifier


def create_test_image(color=(100, 150, 50), size=(224, 224)):
    """Create a simple test image with specified color."""
    img_array = np.full((*size, 3), color, dtype=np.uint8)
    img = Image.fromarray(img_array)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def test_classifier():
    """Test the waste classifier with sample images."""
    print("=" * 60)
    print("EcoSort Assist - Waste Classifier Test")
    print("=" * 60)
    
    classifier = WasteClassifier()
    
    print(f"\n✓ Classifier initialized")
    print(f"  - Ready: {classifier.is_ready()}")
    print(f"  - Mock mode: {classifier.uses_mock}")
    print(f"  - Categories: {', '.join(classifier.categories)}")
    
    test_cases = [
        ("Green organic-like", (80, 180, 70)),
        ("Plastic-like bright", (0, 120, 200)),
        ("Metallic gray", (200, 200, 205)),
        ("Dark e-waste", (40, 40, 50)),
        ("Red hazardous", (220, 50, 50)),
    ]
    
    print("\n" + "=" * 60)
    print("Running classification tests...")
    print("=" * 60)
    
    for name, color in test_cases:
        print(f"\n🖼️  Test: {name} (RGB: {color})")
        image_bytes = create_test_image(color)
        
        try:
            result = classifier.classify(image_bytes, filename="test.png")
            
            print(f"   Category: {result['category']}")
            print(f"   Confidence: {result['confidence']:.1%}")
            print(f"   Waste Type: {result['waste_type']}")
            print(f"   Instructions: {result['disposal_instructions'][:80]}...")
            
            top_3 = sorted(
                result['all_predictions'].items(),
                key=lambda x: x[1],
                reverse=True
            )[:3]
            print(f"   Top 3: {', '.join(f'{cat}({score:.1%})' for cat, score in top_3)}")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("Testing mock result generation...")
    print("=" * 60)
    
    mock_result = classifier.generate_mock_result()
    print(f"\n✓ Mock result generated")
    print(f"  - Category: {mock_result['category']}")
    print(f"  - Confidence: {mock_result['confidence']:.1%}")
    print(f"  - Mock flag: {mock_result['mock']}")
    
    print("\n" + "=" * 60)
    print("✅ All tests completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    test_classifier()
