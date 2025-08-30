import React from 'react';
import { Trophy, Target, Calendar, TrendingUp, Award, Clock } from 'lucide-react';

interface DashboardProps {
  progress: {
    interviewsCompleted: number;
    conversationMinutes: number;
    vocabularyLearned: number;
    presentationsPracticed: number;
  };
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, onBack }) => {
  const achievements = [
    {
      id: 1,
      title: 'First Interview',
      description: 'Completed your first interview simulation',
      icon: Trophy,
      earned: true,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 2,
      title: 'Conversation Starter',
      description: 'Had 60+ minutes of conversation practice',
      icon: Target,
      earned: progress.conversationMinutes >= 60,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      title: 'Word Master',
      description: 'Learned 50+ new vocabulary words',
      icon: Award,
      earned: progress.vocabularyLearned >= 50,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 4,
      title: 'Presentation Pro',
      description: 'Completed 5+ presentation practices',
      icon: TrendingUp,
      earned: progress.presentationsPracticed >= 5,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const weeklyGoals = [
    {
      title: 'Complete 3 interviews',
      current: progress.interviewsCompleted % 7,
      target: 3,
      color: 'bg-blue-600'
    },
    {
      title: '2 hours conversation',
      current: Math.min(progress.conversationMinutes / 60, 2),
      target: 2,
      color: 'bg-green-600'
    },
    {
      title: 'Learn 15 new words',
      current: progress.vocabularyLearned % 15,
      target: 15,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Dashboard</h2>
        <p className="text-gray-600">Track your progress and celebrate your achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{progress.interviewsCompleted}</div>
          <div className="text-sm text-gray-600">Interviews Completed</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(progress.conversationMinutes / 60)}h</div>
          <div className="text-sm text-gray-600">Conversation Time</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{progress.vocabularyLearned}</div>
          <div className="text-sm text-gray-600">Words Learned</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{progress.presentationsPracticed}</div>
          <div className="text-sm text-gray-600">Presentations</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Goals */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Weekly Goals
          </h3>
          <div className="space-y-6">
            {weeklyGoals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">{goal.title}</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(goal.current)}/{goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${goal.color}`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.earned
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${achievement.color} ${
                    !achievement.earned && 'grayscale opacity-50'
                  }`}>
                    <achievement.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.earned ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600 font-semibold text-sm">
                      ✓ Earned
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-600" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Completed Interview Simulation</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Practiced Fluency Coach for 15 minutes</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Learned 5 new vocabulary words</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;