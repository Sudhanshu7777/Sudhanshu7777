import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

interface InterviewSimulatorProps {
  onBack: () => void;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const interviewQuestions = [
    {
      question: "Tell me about yourself and your professional background.",
      tips: "Keep it concise, focus on relevant experience, and end with your career goals.",
      feedback: "Great start! Remember to structure your answer: past experience → current situation → future goals."
    },
    {
      question: "What are your greatest strengths?",
      tips: "Choose 2-3 strengths relevant to the role and provide specific examples.",
      feedback: "Good choice of strengths! Try to include specific examples or metrics to make your answer more compelling."
    },
    {
      question: "Why do you want to work for our company?",
      tips: "Research the company and connect your values with theirs.",
      feedback: "Show that you've researched the company. Connect your personal goals with the company's mission."
    },
    {
      question: "Describe a challenging situation at work and how you handled it.",
      tips: "Use the STAR method: Situation, Task, Action, Result.",
      feedback: "Perfect! Using the STAR method helps structure your response clearly and professionally."
    }
  ];

  const handleSubmitAnswer = () => {
    if (userAnswer.trim()) {
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      setSessionComplete(true);
    }
  };

  const resetSession = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setShowFeedback(false);
    setSessionComplete(false);
  };

  if (sessionComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Congratulations! You've completed the interview simulation. Keep practicing to build confidence.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetSession}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Interview Simulator</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {interviewQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Question:</h3>
              <p className="text-lg text-gray-700">{interviewQuestions[currentQuestion].question}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Pro Tip:</h4>
                <p className="text-yellow-700">{interviewQuestions[currentQuestion].tips}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Answer:
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here... Speak naturally and be specific with examples."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={showFeedback}
          />
        </div>

        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Get Feedback
          </button>
        ) : (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Feedback & Suggestions:
              </h4>
              <p className="text-green-700">{interviewQuestions[currentQuestion].feedback}</p>
            </div>
            <button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              {currentQuestion < interviewQuestions.length - 1 ? 'Next Question' : 'Complete Interview'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulator;