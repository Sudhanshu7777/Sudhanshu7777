"""Script to create and save a demo TensorFlow Lite model for waste classification."""

import os
from pathlib import Path

import numpy as np
import tensorflow as tf


CATEGORIES = ["Organic", "Recyclable", "Plastic", "Metal", "E-Waste", "Hazardous", "Mixed"]
MODEL_INPUT_SHAPE = (224, 224, 3)


def create_demo_model():
    """Create a simple CNN model for waste classification."""
    print("Creating demo waste classification CNN model...")
    
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=MODEL_INPUT_SHAPE),
        
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Dropout(0.25),
        
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(len(CATEGORIES), activation='softmax')
    ], name='waste_classifier_demo')
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"Model created with {len(CATEGORIES)} output classes")
    model.summary()
    
    return model


def save_tflite_model(model, output_path):
    """Convert and save model as TensorFlow Lite."""
    print(f"Converting model to TensorFlow Lite format...")
    
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()
    
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"TFLite model saved to: {output_path}")
    print(f"Model size: {len(tflite_model) / 1024:.2f} KB")


def save_h5_model(model, output_path):
    """Save model in HDF5 format."""
    model.save(output_path)
    print(f"H5 model saved to: {output_path}")


if __name__ == "__main__":
    script_dir = Path(__file__).parent
    models_dir = script_dir / "models"
    models_dir.mkdir(exist_ok=True)
    
    model = create_demo_model()
    
    tflite_path = models_dir / "waste_classifier.tflite"
    save_tflite_model(model, tflite_path)
    
    h5_path = models_dir / "waste_classifier.h5"
    save_h5_model(model, h5_path)
    
    print("\n✅ Demo model creation complete!")
    print(f"   - TFLite model: {tflite_path}")
    print(f"   - H5 model: {h5_path}")
    print("\nNote: This is a demo model with random weights.")
    print("For production, train on a labeled waste dataset.")
