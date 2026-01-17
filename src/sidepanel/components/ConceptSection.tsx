import React, { useState } from 'react';
import type { ConceptFeedback } from '../../types/feedback';

interface ConceptSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  concepts: ConceptFeedback[];
  showHints?: boolean;
  defaultExpanded?: boolean;
}

export function ConceptSection({
  title,
  icon,
  iconColor,
  bgColor,
  concepts,
  showHints = false,
  defaultExpanded = true,
}: ConceptSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  if (concepts.length === 0) return null;

  const toggleHint = (index: number) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={`rounded-xl border ${bgColor} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">({concepts.length})</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {concepts.map((concept, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className={`${iconColor} font-medium`}>{concept.concept}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{concept.explanation}</p>

              {showHints && concept.hint && (
                <div className="mt-3">
                  {revealedHints.has(index) ? (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg animate-fade-in">
                      <p className="text-sm text-primary-700 dark:text-primary-300">
                        💡 <span className="font-medium">힌트:</span> {concept.hint}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleHint(index)}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      힌트 보기
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
