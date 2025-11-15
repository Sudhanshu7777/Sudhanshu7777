import React, { useRef, useState } from 'react';
import { Upload, Camera, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  error?: string | null;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  selectedFile,
  previewUrl,
  error,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            handleFileSelect(file);
          }
        }, 'image/jpeg', 0.9);
      }
    }
    stopCamera();
  };

  const clearSelection = () => {
    onFileSelect(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (previewUrl && selectedFile) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={previewUrl}
            alt="Selected waste"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={clearSelection}
            disabled={disabled}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-medium">{selectedFile.name}</p>
          <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  if (showCamera) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded-lg bg-black"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={capturePhoto}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Capture Photo
          </button>
          <button
            onClick={stopCamera}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            error ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Upload className="w-8 h-8 text-gray-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging ? 'Drop your image here' : 'Upload waste image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
          </div>

          <div className="text-xs text-gray-400">
            Supports: JPEG, PNG, WebP (Max 10MB)
          </div>
        </div>
      </div>

      {/* Camera Button */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={startCamera}
          disabled={disabled}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Use Camera
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};
