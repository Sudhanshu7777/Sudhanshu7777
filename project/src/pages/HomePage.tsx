import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Recycle, 
  Leaf, 
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Smart Classification',
      description: 'AI-powered waste classification with instant results',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location-Based',
      description: 'Find nearby recycling centers and disposal facilities',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'Eco-Friendly',
      description: 'Promote sustainable waste management practices',
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600'
    }
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate' },
    { number: '50+', label: 'Waste Categories' },
    { number: '1000+', label: 'Daily Users' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Smart Waste
          <span className="text-green-600"> Classification</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform waste management with AI-powered classification. 
          Identify, sort, and dispose of waste responsibly with just a photo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/classify')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Classifying
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/complaint')}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-lg border-2 border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border-2 ${feature.color} hover:shadow-lg transition-all duration-300`}
          >
            <div className={`${feature.iconColor} mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: 'Take Photo', description: 'Capture or upload an image of waste' },
            { step: 2, title: 'AI Analysis', description: 'Our AI identifies the waste type' },
            { step: 3, title: 'Get Results', description: 'Receive classification and disposal info' },
            { step: 4, title: 'Dispose Properly', description: 'Follow eco-friendly disposal guidelines' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users making smarter waste decisions every day
        </p>
        <button
          onClick={() => navigate('/classify')}
          className="bg-white text-green-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
        >
          <Smartphone className="w-5 h-5" />
          Get Started Now
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span>Available Worldwide</span>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          <span>Mobile Friendly</span>
        </div>
      </div>
    </div>
  );
};
