import React from 'react';
import { FEEDBACK_LEVEL_CONFIG, type FeedbackLevel } from '../../types/feedback';

interface ScoreCardProps {
  score: number;
  level: FeedbackLevel;
  summary: string;
}

export function ScoreCard({ score, level, summary }: ScoreCardProps) {
  const config = FEEDBACK_LEVEL_CONFIG[level];

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getCircleColor = () => {
    if (score >= 90) return 'stroke-green-500';
    if (score >= 70) return 'stroke-blue-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-orange-500';
  };

  // SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-6">
        {/* Score Circle */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={getCircleColor()}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">점</span>
          </div>
        </div>

        {/* Level and Summary */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{config.emoji}</span>
            <span className={`text-lg font-semibold ${config.color}`}>{config.label}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
