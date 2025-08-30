import React, { useState } from 'react';
import { Play, Clock, CheckCircle, Target, Lightbulb } from 'lucide-react';

interface PresentationPracticeProps {
  onBack: () => void;
}

const PresentationPractice: React.FC<PresentationPracticeProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [presentationText, setPresentationText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const practiceTopics = [
    { id: 'intro', title: 'Introduce Your Company', description: 'Practice introducing your company to new clients' },
    { id: 'product', title: 'Product Presentation', description: 'Present a product or service to potential customers' },
    { id: 'quarterly', title: 'Quarterly Results', description: 'Present quarterly business results to stakeholders' },
    { id: 'proposal', title: 'Project Proposal', description: 'Pitch a new project idea to management' },
    { id: 'training', title: 'Training Session', description: 'Conduct a training session for team members' },
    { id: 'custom', title: 'Custom Topic', description: 'Practice with your own presentation topic' }
  ];

  const handleStartPractice = () => {
    setIsRecording(true);
    setTimeElapsed(0);
    
    // Simulate timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Auto-stop after demo purposes (in real app, user would stop manually)
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      if (presentationText.trim()) {
        setShowFeedback(true);
      }
    }, 5000);
  };

  const analyzePresentationStructure = (text: string) => {
    const wordCount = text.split(' ').length;
    const hasIntroduction = text.toLowerCase().includes('hello') || text.toLowerCase().includes('welcome') || text.toLowerCase().includes('today');
    const hasConclusion = text.toLowerCase().includes('conclusion') || text.toLowerCase().includes('summary') || text.toLowerCase().includes('thank you');
    
    return {
      wordCount,
      estimatedDuration: Math.ceil(wordCount / 150), // Average speaking pace
      hasIntroduction,
      hasConclusion,
      clarity: wordCount > 50 ? 'Good' : 'Needs improvement',
      structure: hasIntroduction && hasConclusion ? 'Well-structured' : 'Could improve structure'
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showFeedback) {
    const analysis = analyzePresentationStructure(presentationText);
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Presentation Analysis</h2>
            <p className="text-gray-600">Here's your detailed feedback and suggestions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Word Count:</span>
                  <span className="font-semibold">{analysis.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Duration:</span>
                  <span className="font-semibold">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Speaking Pace:</span>
                  <span className="font-semibold">Good</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Clarity:</span>
                  <span className="font-semibold">{analysis.clarity}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Improvement Suggestions
              </h3>
              <div className="space-y-2 text-green-800">
                {!analysis.hasIntroduction && (
                  <p>• Start with a clear introduction to engage your audience</p>
                )}
                {!analysis.hasConclusion && (
                  <p>• End with a strong conclusion that summarizes key points</p>
                )}
                <p>• Use more transition phrases to improve flow</p>
                <p>• Include specific examples to support your points</p>
                <p>• Practice maintaining eye contact with the audience</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setShowFeedback(false);
                setPresentationText('');
                setSelectedTopic('');
                setTimeElapsed(0);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Practice Again
            </button>
            <button
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Presentation Practice</h2>
        <p className="text-gray-600">Choose a topic and practice your presentation skills with real-time feedback</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Select a Practice Topic:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {practiceTopics.map((topic) => (
              <div
                key={topic.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedTopic === topic.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <h4 className="font-semibold text-gray-900 mb-1">{topic.title}</h4>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedTopic && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Your Presentation:</h3>
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono">{formatTime(timeElapsed)}</span>
                </div>
              )}
            </div>
            
            <textarea
              value={presentationText}
              onChange={(e) => setPresentationText(e.target.value)}
              placeholder="Start typing your presentation here... Remember to include an introduction, main points, and conclusion."
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isRecording}
            />
          </div>
        )}

        {selectedTopic && !isRecording && (
          <button
            onClick={handleStartPractice}
            disabled={!presentationText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Practice Session
          </button>
        )}

        {isRecording && (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 font-semibold">Recording in progress...</p>
              <p className="text-red-600 text-sm mt-1">Practice speaking your presentation aloud</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationPractice;