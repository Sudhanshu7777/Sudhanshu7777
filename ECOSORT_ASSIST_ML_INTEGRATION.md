# EcoSort Assist - ML Model Integration Documentation

## Overview

This document describes the TensorFlow Lite waste classification model integration for EcoSort Assist, a system that classifies waste images into 7 categories and provides disposal instructions.

## Quick Start

### Installation

```bash
cd "Domain based chatbot"

# Install dependencies
pip install --user --break-system-packages -r requirements.txt

# Generate sample images for testing
python3 -m ml.sample_images

# Run unit tests
python3 test_classification.py
```

### Start the Server

```bash
python3 app.py
```

The Flask server will start on `http://localhost:5000` with the classification endpoints available at `/api/classify`.

### Test the API

```bash
# In a separate terminal
python3 test_api.py
```

## System Architecture

### Components

1. **ML Module** (`ml/`)
   - `waste_classifier.py` - Main classifier with TFLite support and heuristic fallback
   - `image_preprocessing.py` - Image processing pipeline (OpenCV, PIL)
   - `disposal_instructions.py` - Waste category to disposal guidance mapping
   - `exceptions.py` - Custom exception classes
   - `create_demo_model.py` - Script to generate demo TFLite models
   - `sample_images.py` - Generate test images
   - `models/` - Directory for TFLite model files

2. **Flask API** (`app.py`)
   - `/api/classify` - Main classification endpoint
   - `/api/classify/test` - Testing endpoint with mock data
   - `/api/classify/status` - Service status and configuration

3. **Test Scripts**
   - `test_classification.py` - Unit tests for classifier
   - `test_api.py` - Integration tests for API endpoints

## Waste Categories

| Category | Waste Type | Example Items |
|----------|------------|---------------|
| Organic | Compostable | Food scraps, garden waste, leaves |
| Recyclable | Recyclable | Paper, cardboard, clean containers |
| Plastic | Recyclable | Bottles, plastic containers, packaging |
| Metal | Recyclable | Cans, tins, aluminum foil |
| E-Waste | Special Disposal | Electronics, batteries, circuit boards |
| Hazardous | Hazardous | Chemicals, medical waste, paint |
| Mixed | General Waste | Combined or contaminated materials |

## API Endpoints

### POST `/api/classify`

Classify waste from an uploaded image.

**Request:**
```http
POST /api/classify HTTP/1.1
Content-Type: multipart/form-data

image: <binary file data>
```

**Success Response (200 OK):**
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

**Error Responses:**

- **400 Bad Request** - Invalid image format or no image provided
```json
{
  "error": "Invalid image: Failed to read image: cannot identify image file"
}
```

- **422 Unprocessable Entity** - Low confidence prediction
```json
{
  "error": "Low confidence prediction",
  "message": "Prediction confidence (45.23%) below threshold (60%)",
  "confidence": 0.4523,
  "threshold": 0.6,
  "suggestion": "Try uploading a clearer image with better lighting"
}
```

- **503 Service Unavailable** - Model not ready
```json
{
  "error": "Classification service unavailable"
}
```

### GET/POST `/api/classify/test`

Test classification endpoint. GET returns mock data, POST accepts an image like `/api/classify`.

**GET Response (200 OK):**
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

**Response (200 OK):**
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

## Model Specifications

### Input Requirements

- **Format**: RGB image (JPEG, PNG, BMP, WebP)
- **Dimensions**: Resized to 224×224 pixels
- **Normalization**: Pixel values scaled to [0, 1]
- **Data type**: float32
- **Shape**: (1, 224, 224, 3)
- **Max file size**: 10 MB

### Output Format

- **Type**: Softmax probabilities
- **Shape**: (7,) - one probability per category
- **Confidence threshold**: 60% (0.60)
- **Response time target**: < 3 seconds

### Image Preprocessing Pipeline

1. **Format Validation** - Check file extension
2. **Image Loading** - Read bytes using PIL
3. **RGB Conversion** - Convert to 3-channel RGB
4. **Resizing** - Resize to 224×224 using area interpolation
5. **Normalization** - Scale to [0, 1] range
6. **Batching** - Add batch dimension

Optional:
- **Grayscale** - Convert to single channel (model-dependent)
- **Augmentation** - Rotation and brightness adjustment (test mode)

## Model Implementation

### TensorFlow Lite Model

The classifier attempts to load a TensorFlow Lite model from:
```
Domain based chatbot/ml/models/waste_classifier.tflite
```

If the model file exists and TensorFlow/TFLite is available, it will be used for inference.

### Heuristic Fallback

If no TFLite model is found or TensorFlow is unavailable, the classifier automatically falls back to a heuristic-based classifier that uses image statistics:

- **Color analysis**: RGB channel means and ratios
- **Brightness**: Overall image brightness
- **Saturation**: Color intensity
- **Texture**: Statistical properties

This ensures the system works out-of-the-box for development and testing without requiring a trained model.

### Creating a Demo Model

To generate a demo TensorFlow Lite model:

```bash
cd "Domain based chatbot"
python3 -m ml.create_demo_model
```

This creates:
- `ml/models/waste_classifier.tflite` - TFLite model (optimized)
- `ml/models/waste_classifier.h5` - Keras model (for training)

**Note**: Demo models have random weights and are for structure/testing only.

## Disposal Instructions

Each category has associated disposal guidance:

| Category | Instructions |
|----------|-------------|
| **Organic** | Place food scraps and green waste into a compost or green bin. Remove any packaging and keep liquids minimal to prevent odors. |
| **Recyclable** | Ensure paper and cardboard are clean and dry, flatten boxes, and place them in the blue recycling bin. |
| **Plastic** | Rinse bottles and containers, remove caps and labels if possible, and place them in the plastic recycling stream. |
| **Metal** | Rinse cans and tins, crush them to save space, and recycle according to municipal guidelines. |
| **E-Waste** | Back up data, remove batteries when possible, and drop off electronics at a certified e-waste collection point. |
| **Hazardous** | Seal chemicals or medical waste in leak-proof containers and deliver them to a hazardous waste facility. Do not place in regular bins. |
| **Mixed** | Separate recyclable and compostable items when possible. Place the remaining waste into the general trash bin. |

## Error Handling

### Validation Errors (400)

- Empty file
- File too large (> 10 MB)
- Invalid format (not JPG/PNG/BMP/WebP)
- No image in request
- Corrupted image file

### Classification Errors (422)

- Low confidence (< 60%)
  - Occurs when the model cannot confidently classify the image
  - Suggestion: Upload clearer image with better lighting
  - Returns the low confidence value for debugging

### Service Errors (503)

- Model not loaded
- TensorFlow initialization failure
- System resource issues

## Testing

### Unit Tests

```bash
python3 test_classification.py
```

Tests the classifier with synthetic colored images:
- Green organic-like
- Plastic-like bright blue
- Metallic gray
- Dark e-waste
- Red hazardous

### API Integration Tests

```bash
# Start server in one terminal
python3 app.py

# Run tests in another terminal
python3 test_api.py
```

Tests all API endpoints:
- Status endpoint
- Mock classification
- Image classification with samples
- Invalid file rejection

### Sample Images

Generate test images for each category:

```bash
python3 -m ml.sample_images
```

Creates PNG files in `ml/samples/`:
- organic.png
- recyclable.png
- plastic.png
- metal.png
- ewaste.png
- hazardous.png
- mixed.png

## Performance

### Current Performance (Heuristic Mode)

- **Initialization**: < 100ms
- **Image preprocessing**: 50-100ms
- **Classification**: 10-50ms
- **Total response time**: < 200ms

### Expected Performance (TFLite Model)

- **Model loading**: 200-500ms (one-time, on startup)
- **Image preprocessing**: 50-100ms
- **Model inference**: 100-300ms
- **Total response time**: < 500ms

### Optimization Strategies

1. **Model quantization** - Use INT8 quantization for smaller size and faster inference
2. **GPU acceleration** - Enable GPU delegate if available
3. **Batch processing** - Process multiple images in one inference call
4. **Caching** - Cache frequently classified items
5. **Image compression** - Reduce file size before upload

## Production Deployment

### Training a Production Model

For production use, train on a real waste dataset:

1. **Dataset Collection**
   - Collect 1000+ images per category
   - Ensure diverse lighting, angles, backgrounds
   - Balance class distribution

2. **Data Augmentation**
   - Rotation: ±20°
   - Brightness: ±20%
   - Zoom: 0.8-1.2×
   - Horizontal flip
   - Gaussian noise

3. **Model Architecture**
   - Use transfer learning (EfficientNet, MobileNetV3)
   - Fine-tune on waste dataset
   - Optimize for mobile/edge deployment

4. **Training**
   ```python
   model = tf.keras.applications.EfficientNetB0(
       include_top=False,
       input_shape=(224, 224, 3),
       weights='imagenet'
   )
   # Add classification head and train
   ```

5. **Conversion to TFLite**
   ```python
   converter = tf.lite.TFLiteConverter.from_keras_model(model)
   converter.optimizations = [tf.lite.Optimize.DEFAULT]
   tflite_model = converter.convert()
   ```

### Deployment Checklist

- [ ] Train model on real waste dataset
- [ ] Validate accuracy > 85% on test set
- [ ] Convert to TFLite with quantization
- [ ] Test model size < 10MB
- [ ] Verify inference time < 300ms
- [ ] Load model on server startup
- [ ] Enable HTTPS for API endpoints
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure CORS for frontend
- [ ] Add authentication if needed

## Integration with Frontend

### JavaScript/TypeScript Example

```typescript
interface ClassificationResult {
  waste_type: string;
  category: string;
  confidence: number;
  disposal_instructions: string;
  model_timestamp: string;
  all_predictions: Record<string, number>;
  mock: boolean;
}

async function classifyWaste(imageFile: File): Promise<ClassificationResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('http://localhost:5000/api/classify', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Classification failed');
  }
  
  return response.json();
}

// Usage in React component
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  try {
    const result = await classifyWaste(file);
    console.log(`Category: ${result.category}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Disposal: ${result.disposal_instructions}`);
  } catch (error) {
    console.error('Classification failed:', error);
  }
};
```

### React Component Example

```tsx
import React, { useState } from 'react';

function WasteClassifier() {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleClassify(e.target.files[0])}
      />
      
      {loading && <p>Classifying...</p>}
      {error && <p className="error">{error}</p>}
      
      {result && (
        <div className="result">
          <h3>{result.category}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <p>{result.disposal_instructions}</p>
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

**Model not loading**
- Check that TensorFlow is installed: `pip list | grep tensorflow`
- Verify model file exists: `ls -l ml/models/waste_classifier.tflite`
- Check file permissions
- Falls back to heuristic mode automatically

**Low confidence predictions**
- Use clear, well-lit photos
- Ensure waste item fills most of the frame
- Avoid blurry or distant shots
- Try different angles

**Connection errors**
- Ensure Flask server is running: `python3 app.py`
- Check server is listening on correct port (5000)
- Verify CORS settings for cross-origin requests

**Import errors**
- Install dependencies: `pip install --user --break-system-packages -r requirements.txt`
- Check Python version: `python3 --version` (requires 3.8+)

## Future Enhancements

- [ ] Multi-object detection (classify multiple waste items in one image)
- [ ] Real-time video classification
- [ ] Mobile app integration
- [ ] Batch processing API
- [ ] Model versioning and A/B testing
- [ ] User feedback and active learning
- [ ] Location-based disposal instructions
- [ ] Recycling center locator
- [ ] Gamification and rewards
- [ ] Carbon footprint tracking

## References

- [TensorFlow Lite Guide](https://www.tensorflow.org/lite/guide)
- [OpenCV Python Documentation](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Waste Classification Datasets](https://github.com/topics/waste-classification)

## License

Part of EcoSort Assist application.

## Support

For issues or questions, please check:
- `ml/README.md` - Detailed ML module documentation
- `test_classification.py` - Unit test examples
- `test_api.py` - API test examples
