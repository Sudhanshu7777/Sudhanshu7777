# Model Artifacts

Place trained TensorFlow Lite models in this directory.

- `waste_classifier.tflite` – Primary model used by `WasteClassifier`
- `waste_classifier.h5` – Optional Keras model (used for training/export)

If the `.tflite` file is absent, the application falls back to a heuristic classifier with deterministic disposal guidance.
