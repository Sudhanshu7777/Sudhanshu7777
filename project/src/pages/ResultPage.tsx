import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResultDashboard } from '../components/ResultDashboard';
import { useClassificationStore } from '../stores/ClassificationStore';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { result, reset } = useClassificationStore();

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">Please classify an image first to see results.</p>
          <button
            onClick={() => navigate('/classify')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Classify New Image
          </button>
        </div>
      </div>
    );
  }

  const handleNewClassification = () => {
    reset();
    navigate('/classify');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/classify')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classification Results</h1>
            <p className="text-gray-600 mt-1">Here's what we found in your image</p>
          </div>
        </div>
        <button
          onClick={handleNewClassification}
          className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Classify Another
        </button>
      </div>

      {/* Results */}
      <ResultDashboard result={result} />

      {/* Map Placeholder */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Nearby Disposal Locations</h2>
        </div>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Interactive map coming soon</p>
            <p className="text-sm text-gray-500 mt-1">Find nearby recycling centers and disposal facilities</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/complaint')}
          className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Report Incorrect Classification
        </button>
        <button
          onClick={handleNewClassification}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Classify New Item
        </button>
      </div>
    </div>
  );
};
