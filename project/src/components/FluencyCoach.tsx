import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface FluencyCoachProps {
  onBack: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'coach';
  content: string;
  corrections?: string[];
  suggestions?: string[];
}

const FluencyCoach: React.FC<FluencyCoachProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'coach',
      content: "Hello! I'm your fluency coach. Let's start with a casual conversation. How was your day today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationMode, setConversationMode] = useState<'casual' | 'formal' | 'workplace'>('casual');

  const analyzeMessage = (message: string) => {
    const corrections: string[] = [];
    const suggestions: string[] = [];

    // Simple analysis (in a real app, this would use NLP)
    if (message.toLowerCase().includes('i was go')) {
      corrections.push('Use "I went" instead of "I was go"');
    }
    if (message.toLowerCase().includes('very good')) {
      suggestions.push('Try "excellent" or "fantastic" for more variety');
    }
    if (!message.endsWith('.') && !message.endsWith('!') && !message.endsWith('?')) {
      corrections.push('Remember to end sentences with proper punctuation');
    }

    return { corrections, suggestions };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const analysis = analyzeMessage(inputMessage);
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      corrections: analysis.corrections,
      suggestions: analysis.suggestions
    };

    const coachResponses = [
      "That's interesting! Can you tell me more about that?",
      "I understand. How did that make you feel?",
      "That sounds challenging. What did you learn from the experience?",
      "Great! What would you do differently next time?",
      "I see. Can you give me a specific example?"
    ];

    const coachMessage: Message = {
      id: messages.length + 2,
      type: 'coach',
      content: coachResponses[Math.floor(Math.random() * coachResponses.length)]
    };

    setMessages([...messages, userMessage, coachMessage]);
    setInputMessage('');
  };

  const getModeDescription = () => {
    switch (conversationMode) {
      case 'casual':
        return 'Practice everyday conversations with friends and family';
      case 'formal':
        return 'Practice formal situations like presentations or meetings';
      case 'workplace':
        return 'Practice professional communication with colleagues';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Fluency Coach</h2>
        
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Conversation Mode:</h3>
          <div className="flex gap-2 mb-2">
            {(['casual', 'formal', 'workplace'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setConversationMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  conversationMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">{getModeDescription()}</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg h-96 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Show corrections and suggestions for user messages */}
                  {message.type === 'user' && (message.corrections?.length || message.suggestions?.length) && (
                    <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg text-xs">
                      {message.corrections && message.corrections.length > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="font-semibold">Corrections:</span>
                          </div>
                          {message.corrections.map((correction, index) => (
                            <p key={index} className="text-yellow-100">• {correction}</p>
                          ))}
                        </div>
                      )}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <CheckCircle className="w-3 h-3" />
                            <span className="font-semibold">Suggestions:</span>
                          </div>
                          {message.suggestions.map((suggestion, index) => (
                            <p key={index} className="text-green-100">• {suggestion}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluencyCoach;