import React, { useState } from 'react';
import { MessageCircle, Briefcase, Presentation, BookOpen, Trophy, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import InterviewSimulator from './components/InterviewSimulator';
import FluencyCoach from './components/FluencyCoach';
import PresentationPractice from './components/PresentationPractice';
import VocabularyHelper from './components/VocabularyHelper';
import Dashboard from './components/Dashboard';

type ActiveView = 'home' | 'interview' | 'fluency' | 'presentation' | 'vocabulary' | 'dashboard';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [userProgress] = useState({
    interviewsCompleted: 12,
    conversationMinutes: 145,
    vocabularyLearned: 78,
    presentationsPracticed: 6
  });

  const renderActiveView = () => {
    switch (activeView) {
      case 'interview':
        return <InterviewSimulator onBack={() => setActiveView('home')} />;
      case 'fluency':
        return <FluencyCoach onBack={() => setActiveView('home')} />;
      case 'presentation':
        return <PresentationPractice onBack={() => setActiveView('home')} />;
      case 'vocabulary':
        return <VocabularyHelper onBack={() => setActiveView('home')} />;
      case 'dashboard':
        return <Dashboard progress={userProgress} onBack={() => setActiveView('home')} />;
      default:
        return (
          <main className="max-w-6xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Master Professional English Communication
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Build confidence in interviews, presentations, and workplace conversations with AI-powered coaching
              </p>
              <button
                onClick={() => setActiveView('dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center mx-auto gap-2"
              >
                <Trophy className="w-5 h-5" />
                View Your Progress
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <FeatureCard
                icon={<Briefcase className="w-8 h-8" />}
                title="Interview Simulator"
                description="Practice with realistic job interview questions and get instant feedback on your answers."
                color="bg-blue-50 border-blue-200"
                iconColor="text-blue-600"
                onClick={() => setActiveView('interview')}
              />
              <FeatureCard
                icon={<MessageCircle className="w-8 h-8" />}
                title="Fluency Coach"
                description="Engage in daily conversations and receive gentle corrections to improve your fluency."
                color="bg-green-50 border-green-200"
                iconColor="text-green-600"
                onClick={() => setActiveView('fluency')}
              />
              <FeatureCard
                icon={<Presentation className="w-8 h-8" />}
                title="Presentation Practice"
                description="Perfect your presentation skills with structured feedback on clarity and professionalism."
                color="bg-purple-50 border-purple-200"
                iconColor="text-purple-600"
                onClick={() => setActiveView('presentation')}
              />
              <FeatureCard
                icon={<BookOpen className="w-8 h-8" />}
                title="Vocabulary & Grammar Helper"
                description="Discover better words, phrases, and sentence structures for professional communication."
                color="bg-orange-50 border-orange-200"
                iconColor="text-orange-600"
                onClick={() => setActiveView('vocabulary')}
              />
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Learning Journey</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{userProgress.interviewsCompleted}</div>
                  <div className="text-sm text-gray-600">Interviews Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{userProgress.conversationMinutes}</div>
                  <div className="text-sm text-gray-600">Conversation Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{userProgress.vocabularyLearned}</div>
                  <div className="text-sm text-gray-600">New Words Learned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{userProgress.presentationsPracticed}</div>
                  <div className="text-sm text-gray-600">Presentations Practiced</div>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onNavigate={setActiveView} currentView={activeView} />
      {renderActiveView()}
    </div>
  );
}

export default App;