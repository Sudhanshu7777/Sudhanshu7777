import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Info,
  Leaf,
  Trash2,
  Recycle,
  Package
} from 'lucide-react';
import { ClassificationResponse } from '../types/classification';

interface ResultDashboardProps {
  result: ClassificationResponse;
}

const categoryIcons = {
  recyclable: <Recycle className="w-6 h-6" />,
  organic: <Leaf className="w-6 h-6" />,
  hazardous: <AlertTriangle className="w-6 h-6" />,
  general: <Trash2 className="w-6 h-6" />,
  electronic: <Package className="w-6 h-6" />
};

const categoryColors = {
  recyclable: 'bg-blue-50 text-blue-600 border-blue-200',
  organic: 'bg-green-50 text-green-600 border-green-200',
  hazardous: 'bg-red-50 text-red-600 border-red-200',
  general: 'bg-gray-50 text-gray-600 border-gray-200',
  electronic: 'bg-purple-50 text-purple-600 border-purple-200'
};

const confidenceColors = {
  high: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-red-600 bg-red-100'
};

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ result }) => {
  const getConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  const confidenceLevel = getConfidenceLevel(result.confidence);

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Classification Result</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColors[confidenceLevel]}`}>
            {Math.round(result.confidence * 100)}% Confidence
          </div>
        </div>

        {/* Waste Type and Category */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Waste Type</h3>
            <div className="text-2xl font-bold text-gray-900">{result.wasteType}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${categoryColors[result.category as keyof typeof categoryColors]}`}>
              {categoryIcons[result.category as keyof typeof categoryIcons]}
              <span className="font-medium capitalize">{result.category}</span>
            </div>
          </div>
        </div>

        {/* Disposal Instructions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Disposal Instructions
          </h3>
          <div className="space-y-3">
            {result.disposalInstructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Environmental Impact */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Environmental Impact
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CO₂ Saved</span>
              <span className="font-semibold text-green-600">{result.environmentalImpact.co2Saved} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recyclable</span>
              <span className={`font-semibold ${result.environmentalImpact.recyclable ? 'text-green-600' : 'text-gray-400'}`}>
                {result.environmentalImpact.recyclable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Biodegradable</span>
              <span className={`font-semibold ${result.environmentalImpact.biodegradable ? 'text-green-600' : 'text-gray-400'}`}>
                {result.environmentalImpact.biodegradable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Processing Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Processing Time</span>
              <span className="font-semibold">{result.processingTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Timestamp</span>
              <span className="font-semibold">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
            {result.location && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold text-green-600">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Suggestions */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Classifications</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {result.alternatives.map((alt, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{alt.type}</span>
                  <span className="text-sm text-gray-500">{Math.round(alt.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${alt.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
