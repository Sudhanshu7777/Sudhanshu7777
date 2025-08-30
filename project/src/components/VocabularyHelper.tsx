import React, { useState } from 'react';
import { Search, BookOpen, Star, TrendingUp } from 'lucide-react';

interface VocabularyHelperProps {
  onBack: () => void;
}

interface WordSuggestion {
  word: string;
  type: string;
  definition: string;
  example: string;
  professional: boolean;
}

const VocabularyHelper: React.FC<VocabularyHelperProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<WordSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'daily' | 'professional'>('search');

  const wordDatabase: WordSuggestion[] = [
    {
      word: 'collaborate',
      type: 'verb',
      definition: 'to work together with someone to produce something',
      example: 'We collaborate closely with the marketing team on this project.',
      professional: true
    },
    {
      word: 'facilitate',
      type: 'verb',
      definition: 'to make an action or process easier or help bring about',
      example: 'The new software will facilitate better communication between departments.',
      professional: true
    },
    {
      word: 'comprehensive',
      type: 'adjective',
      definition: 'complete and including everything that is necessary',
      example: 'We need a comprehensive analysis of the market trends.',
      professional: true
    },
    {
      word: 'implement',
      type: 'verb',
      definition: 'to put a decision or plan into effect',
      example: 'We will implement the new policy next quarter.',
      professional: true
    },
    {
      word: 'exceptional',
      type: 'adjective',
      definition: 'unusually good; outstanding',
      example: 'Your performance this year has been exceptional.',
      professional: false
    }
  ];

  const dailyWords = [
    'Therefore', 'Furthermore', 'Nevertheless', 'Consequently', 'Moreover'
  ];

  const professionalPhrases = [
    'I would like to propose...',
    'Based on our analysis...',
    'Moving forward, we should...',
    'In my professional opinion...',
    'Let me elaborate on that...'
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = wordDatabase.filter(word => 
        word.word.toLowerCase().includes(term.toLowerCase()) ||
        word.definition.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const renderSearchTab = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for better words and phrases..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Suggestions:</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-bold text-blue-600">{suggestion.word}</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                    {suggestion.type}
                  </span>
                  {suggestion.professional && (
                    <Star className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{suggestion.definition}</p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-blue-800 italic">"{suggestion.example}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm && suggestions.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No results found. Try searching for different terms!</p>
        </div>
      )}
    </div>
  );

  const renderDailyTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Word of the Day</h3>
        <p className="text-gray-600">Expand your vocabulary with these powerful transition words</p>
      </div>

      <div className="grid gap-4">
        {dailyWords.map((word, index) => (
          <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h4 className="text-xl font-bold text-green-700 mb-2">{word}</h4>
            <p className="text-gray-700 mb-3">
              Use this transition word to connect ideas and improve flow in your speech.
            </p>
            <div className="bg-white rounded p-3">
              <p className="text-green-800 italic">
                "The quarterly results were positive. {word}, we expect continued growth next quarter."
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfessionalTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Star className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Phrases</h3>
        <p className="text-gray-600">Master these phrases for workplace communication</p>
      </div>

      <div className="grid gap-4">
        {professionalPhrases.map((phrase, index) => (
          <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">"{phrase}"</h4>
            <p className="text-gray-700 mb-3">
              Use this phrase to sound more professional and confident in meetings and presentations.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Meetings</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Presentations</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Emails</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary & Grammar Helper</h2>
        <p className="text-gray-600">Discover better words, phrases, and expressions for professional communication</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'search', label: 'Word Search', icon: Search },
              { id: 'daily', label: 'Daily Words', icon: TrendingUp },
              { id: 'professional', label: 'Professional', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'search' && renderSearchTab()}
          {activeTab === 'daily' && renderDailyTab()}
          {activeTab === 'professional' && renderProfessionalTab()}
        </div>
      </div>
    </div>
  );
};

export default VocabularyHelper;