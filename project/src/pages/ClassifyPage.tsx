import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useGeolocation } from '../hooks/useGeolocation';
import { useClassificationStore } from '../stores/ClassificationStore';
import { fileToBase64, validateImageFile } from '../utils/imageUtils';

export const ClassifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const { coordinates, error: locationError, isLoading: locationLoading, requestLocation } = useGeolocation();
  const { classifyWaste, isLoading: classificationLoading, error: classificationError, result } = useClassificationStore();

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    setImageError(null);
    
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      setImageError('Please select an image first');
      return;
    }

    // Get location if not already available
    let location = coordinates;
    if (!location && !locationError) {
      try {
        await requestLocation();
        // Note: In a real app, you'd want to wait for the location to update
        // For now, we'll proceed with whatever location we have
      } catch (error) {
        console.warn('Could not get location, proceeding without it');
      }
    }

    try {
      // Convert file to base64
      const imageBase64 = await fileToBase64(selectedFile);
      
      // Classify the image
      await classifyWaste({
        image: imageBase64,
        location: coordinates || undefined,
      });

      // Navigate to result page if classification was successful
      if (result) {
        navigate('/result');
      }
    } catch (error) {
      console.error('Classification failed:', error);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageError(null);
  };

  const isLoading = classificationLoading || locationLoading;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classify Waste</h1>
          <p className="text-gray-600 mt-1">Upload or capture an image to classify waste material</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        {/* Image Upload */}
        <div className="mb-6">
          <ImageUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            error={imageError}
            disabled={isLoading}
          />
        </div>

        {/* Location Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Location Access</h3>
              <p className="text-sm text-gray-600 mt-1">
                {locationLoading ? 'Getting location...' :
                 locationError ? locationError :
                 coordinates ? 'Location acquired' :
                 'Location not required'}
              </p>
            </div>
            {!coordinates && !locationLoading && (
              <button
                onClick={requestLocation}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Enable Location
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {(classificationError || imageError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              {classificationError || imageError}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleClassify}
            disabled={!selectedFile || isLoading}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Classify Waste
              </>
            )}
          </button>
          
          {selectedFile && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting and clear focus</li>
            <li>• Capture the waste item clearly in the frame</li>
            <li>• Avoid multiple items in one image</li>
            <li>• Enable location for better disposal recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
