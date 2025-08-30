import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color, 
  iconColor, 
  onClick 
}) => {
  return (
    <div 
      className={`${color} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
      onClick={onClick}
    >
      <div className={`${iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all duration-300">
        Start Practice
        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  );
};

export default FeatureCard;