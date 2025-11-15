"""Test script for classification API endpoints using requests."""

import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Installing requests...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--user", "--break-system-packages", "requests"])
    import requests


BASE_URL = "http://localhost:5000"


def test_status():
    """Test the status endpoint."""
    print("\n" + "=" * 60)
    print("Testing GET /api/classify/status")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/api/classify/status")
    print(f"Status code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print(f"✓ Service status: {data['status']}")
        print(f"  - Mock mode: {data['mock_mode']}")
        print(f"  - Categories: {', '.join(data['categories'])}")
        print(f"  - Confidence threshold: {data['confidence_threshold']:.0%}")
        print(f"  - Max file size: {data['max_file_size_mb']}MB")
        print(f"  - Allowed formats: {', '.join(data['allowed_formats'])}")
    else:
        print(f"❌ Error: {response.text}")
    
    return response.ok


def test_mock_classification():
    """Test the test endpoint without image."""
    print("\n" + "=" * 60)
    print("Testing GET /api/classify/test (mock)")
    print("=" * 60)
    
    response = requests.get(f"{BASE_URL}/api/classify/test")
    print(f"Status code: {response.status_code}")
    
    if response.ok:
        data = response.json()
        print(f"✓ Mock classification generated")
        print(f"  - Category: {data['category']}")
        print(f"  - Confidence: {data['confidence']:.1%}")
        print(f"  - Waste type: {data['waste_type']}")
        print(f"  - Disposal: {data['disposal_instructions'][:60]}...")
        print(f"  - Test mode: {data.get('test_mode', False)}")
        print(f"  - Mock: {data.get('mock', False)}")
    else:
        print(f"❌ Error: {response.text}")
    
    return response.ok


def test_image_classification(image_path):
    """Test classification with actual image file."""
    print("\n" + "=" * 60)
    print(f"Testing POST /api/classify with {image_path.name}")
    print("=" * 60)
    
    try:
        with open(image_path, "rb") as f:
            files = {"image": (image_path.name, f, "image/png")}
            response = requests.post(f"{BASE_URL}/api/classify", files=files)
        
        print(f"Status code: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"✓ Classification successful")
            print(f"  - Category: {data['category']}")
            print(f"  - Confidence: {data['confidence']:.1%}")
            print(f"  - Waste type: {data['waste_type']}")
            print(f"  - Disposal: {data['disposal_instructions'][:60]}...")
            
            top_3 = sorted(
                data['all_predictions'].items(),
                key=lambda x: x[1],
                reverse=True
            )[:3]
            print(f"  - Top 3: {', '.join(f'{cat}({score:.1%})' for cat, score in top_3)}")
        else:
            error_data = response.json()
            print(f"❌ Error: {error_data.get('error', 'Unknown error')}")
            if 'message' in error_data:
                print(f"   Message: {error_data['message']}")
        
        return response.ok
    
    except FileNotFoundError:
        print(f"❌ Image file not found: {image_path}")
        return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False


def test_invalid_image():
    """Test classification with invalid file."""
    print("\n" + "=" * 60)
    print("Testing POST /api/classify with invalid file")
    print("=" * 60)
    
    files = {"image": ("test.txt", b"Not an image", "text/plain")}
    response = requests.post(f"{BASE_URL}/api/classify", files=files)
    
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 400:
        data = response.json()
        print(f"✓ Invalid image correctly rejected")
        print(f"  - Error: {data.get('error', '')}")
        return True
    else:
        print(f"❌ Expected 400 error but got {response.status_code}")
        return False


def main():
    """Run all API tests."""
    print("=" * 60)
    print("EcoSort Assist - API Endpoint Tests")
    print("=" * 60)
    print(f"\nBase URL: {BASE_URL}")
    print("Make sure the Flask server is running: python3 app.py")
    
    results = []
    
    try:
        results.append(("Status endpoint", test_status()))
        results.append(("Mock classification", test_mock_classification()))
        
        samples_dir = Path(__file__).parent / "ml" / "samples"
        if samples_dir.exists():
            sample_images = list(samples_dir.glob("*.png"))[:3]
            for img_path in sample_images:
                results.append((f"Classify {img_path.name}", test_image_classification(img_path)))
        else:
            print(f"\n⚠️  Sample images not found in {samples_dir}")
            print("   Run: python3 -m ml.sample_images")
        
        results.append(("Invalid file rejection", test_invalid_image()))
        
    except requests.ConnectionError:
        print("\n❌ Connection Error: Flask server is not running!")
        print("   Start the server with: python3 app.py")
        return
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\n{passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed")


if __name__ == "__main__":
    main()
