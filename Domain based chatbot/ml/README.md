# EcoSort Assist - Waste Classification ML Module

## Overview

This module provides TensorFlow Lite-based waste classification capabilities for the EcoSort Assist application. It includes image preprocessing, model inference, and disposal instruction mapping.

## Architecture

```
ml/
├── __init__.py                     # Package exports
├── exceptions.py                   # Custom exception classes
├── disposal_instructions.py        # Waste category disposal guidance
├── image_preprocessing.py          # Image preprocessing utilities
├── waste_classifier.py             # Main classifier implementation
├── create_demo_model.py           # Script to generate demo model
├── models/                        # Model storage directory
│   └── waste_classifier.tflite   # TFLite model file
└── README.md                      # This file
```

## Waste Categories

The classifier supports 7 waste categories:

1. **Organic** - Food scraps, garden waste, compostable materials
2. **Recyclable** - Paper, cardboard (non-contaminated)
3. **Plastic** - Bottles, containers (recyclable plastics)
4. **Metal** - Cans, tins, aluminum
5. **E-Waste** - Electronics, batteries, electronic components
6. **Hazardous** - Chemicals, medical waste, toxic materials
7. **Mixed** - Combined or unseparated waste

## Model Specifications

### Input
- **Format**: RGB image
- **Dimensions**: 224x224 pixels
- **Normalization**: Values scaled to [0, 1]
- **Data type**: Float32
- **Shape**: (1, 224, 224, 3) - batch format

### Output
- **Format**: Softmax probabilities
- **Shape**: (1, 7) - one probability per category
- **Confidence threshold**: 60% (0.60)

### Model Architecture (Demo)
```
Conv2D(32) → BatchNorm → MaxPool → Dropout(0.25)
Conv2D(64) → BatchNorm → MaxPool → Dropout(0.25)
Conv2D(128) → BatchNorm → MaxPool → Dropout(0.25)
Flatten → Dense(256) → BatchNorm → Dropout(0.5)
Dense(7, softmax)
```

## Image Preprocessing Pipeline

1. **Validation**: Check file extension and format
2. **Reading**: Load image from bytes using PIL
3. **Conversion**: Convert to RGB (3 channels)
4. **Resizing**: Resize to 224x224 using area interpolation
5. **Normalization**: Scale pixel values to [0, 1]
6. **Batching**: Add batch dimension (1, H, W, C)

Optional transformations:
- **Grayscale**: Convert to single channel (if model requires)
- **Augmentation**: Rotation (-8° to +8°) and brightness adjustment

## API Endpoints

### POST `/api/classify`

Classify waste from uploaded image.

**Request**:
```
Content-Type: multipart/form-data

image: <file> (required)
```

**Response** (200 OK):
```json
{
  "waste_type": "Recyclable",
  "category": "Plastic",
  "confidence": 0.8234,
  "disposal_instructions": "Rinse bottles and containers, remove caps and labels if possible, and place them in the plastic recycling stream.",
  "model_timestamp": "2024-01-15T10:30:45.123456",
  "all_predictions": {
    "Organic": 0.0234,
    "Recyclable": 0.0512,
    "Plastic": 0.8234,
    "Metal": 0.0123,
    "E-Waste": 0.0211,
    "Hazardous": 0.0156,
    "Mixed": 0.0530
  },
  "mock": false
}
```

**Error Responses**:
- `400`: Invalid image format or no image provided
- `422`: Low confidence (< 60%)
- `503`: Model not ready

### GET/POST `/api/classify/test`

Test endpoint that returns mock predictions or accepts sample images.

**GET Request**: Returns mock classification result

**POST Request**: Same as `/api/classify` but includes test_mode flag

**Response** (200 OK):
```json
{
  "waste_type": "Organic",
  "category": "Organic",
  "confidence": 0.7123,
  "disposal_instructions": "...",
  "model_timestamp": "2024-01-15T10:30:45.123456",
  "all_predictions": {...},
  "mock": true,
  "test_mode": true,
  "note": "Mock classification result for testing"
}
```

### GET `/api/classify/status`

Get classifier service status and configuration.

**Response** (200 OK):
```json
{
  "status": "ready",
  "model_loaded_at": "2024-01-15T10:30:45.123456",
  "mock_mode": false,
  "confidence_threshold": 0.6,
  "categories": ["Organic", "Recyclable", "Plastic", "Metal", "E-Waste", "Hazardous", "Mixed"],
  "max_file_size_mb": 10,
  "allowed_formats": [".bmp", ".jpg", ".jpeg", ".png", ".webp"]
}
```

## Usage Examples

### Python Client

```python
import requests

# Classify image
with open("waste_sample.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:5000/api/classify",
        files={"image": f}
    )
    result = response.json()
    print(f"Category: {result['category']}")
    print(f"Confidence: {result['confidence']:.1%}")
    print(f"Instructions: {result['disposal_instructions']}")

# Check status
status = requests.get("http://localhost:5000/api/classify/status").json()
print(f"Service status: {status['status']}")
print(f"Mock mode: {status['mock_mode']}")

# Test endpoint
test_result = requests.get("http://localhost:5000/api/classify/test").json()
print(f"Test classification: {test_result['category']}")
```

### JavaScript/TypeScript Client

```typescript
async function classifyWaste(imageFile: File): Promise<ClassificationResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/classify', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Classification failed');
  }
  
  return response.json();
}

// Usage
const fileInput = document.querySelector<HTMLInputElement>('#file-input');
const file = fileInput.files?.[0];
if (file) {
  const result = await classifyWaste(file);
  console.log(`Category: ${result.category}`);
  console.log(`Disposal: ${result.disposal_instructions}`);
}
```

### cURL Examples

```bash
# Classify image
curl -X POST http://localhost:5000/api/classify \
  -F "image=@waste_sample.jpg"

# Test endpoint
curl http://localhost:5000/api/classify/test

# Status check
curl http://localhost:5000/api/classify/status
```

## Error Handling

### InvalidImageError
Raised when image format is unsupported or file is corrupted.

```json
{
  "error": "Invalid image: Failed to read image: cannot identify image file"
}
```

### LowConfidenceError
Raised when model confidence is below 60% threshold.

```json
{
  "error": "Low confidence prediction",
  "message": "Prediction confidence (45.23%) below threshold (60%)",
  "threshold": 0.6,
  "suggestion": "Try uploading a clearer image with better lighting"
}
```

### ModelNotReadyError
Raised when model is not loaded.

```json
{
  "error": "Classification service unavailable"
}
```

## Model Training (Production)

For production deployment, train on a labeled waste dataset:

1. **Dataset**: Collect 1000+ images per category
2. **Augmentation**: Use rotation, zoom, brightness, flip
3. **Architecture**: Consider EfficientNet, MobileNetV3, or ResNet50
4. **Training**: Use transfer learning from ImageNet weights
5. **Validation**: Hold out 20% for validation
6. **Export**: Convert to TensorFlow Lite format

```python
# Example training script
model = tf.keras.applications.EfficientNetB0(
    include_top=False,
    input_shape=(224, 224, 3),
    weights='imagenet'
)
model.trainable = False

output = tf.keras.layers.GlobalAveragePooling2D()(model.output)
output = tf.keras.layers.Dense(256, activation='relu')(output)
output = tf.keras.layers.Dropout(0.5)(output)
output = tf.keras.layers.Dense(7, activation='softmax')(output)

final_model = tf.keras.Model(inputs=model.input, outputs=output)
final_model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train and convert to TFLite
# ...
```

## Creating Demo Model

To generate a demo model for development/testing:

```bash
cd "Domain based chatbot"
python -m ml.create_demo_model
```

This creates:
- `ml/models/waste_classifier.tflite` - TensorFlow Lite model
- `ml/models/waste_classifier.h5` - HDF5 model (optional)

**Note**: Demo models have random weights and are for testing only.

## Performance

### Expected Response Times
- Image preprocessing: ~50-100ms
- Model inference (TFLite): ~100-300ms
- Total response time: <500ms (target: <3 seconds)

### Optimization Tips
1. Use TFLite for faster inference
2. Enable GPU acceleration if available
3. Cache model in memory (already implemented)
4. Consider batching multiple requests
5. Use quantization for smaller model size

## Dependencies

- `tensorflow` or `tflite-runtime`: Model inference
- `opencv-python`: Image processing
- `Pillow`: Image loading and format conversion
- `numpy`: Array operations

## Troubleshooting

### Model not loading
- Check that `ml/models/waste_classifier.tflite` exists
- Verify TensorFlow installation
- Falls back to heuristic classifier automatically

### Low confidence errors
- Ensure good lighting in images
- Use clear, focused photos
- Avoid blurry or distant shots
- Try different angles

### Memory issues
- Reduce image size before upload
- Monitor model memory footprint
- Consider using INT8 quantized models

## Future Improvements

- [ ] Multi-object detection (YOLO/SSD)
- [ ] Real-time video classification
- [ ] Transfer learning from larger datasets
- [ ] Model versioning and A/B testing
- [ ] Confidence calibration
- [ ] Active learning pipeline
- [ ] Mobile-optimized models (<5MB)

## License

Part of EcoSort Assist application.
