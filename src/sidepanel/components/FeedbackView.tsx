import React from 'react';
import type { RecallFeedback } from '../../types/feedback';
import { ScoreCard } from './ScoreCard';
import { ConceptSection } from './ConceptSection';
import { DeepDiveQuestion } from './DeepDiveQuestion';

interface FeedbackViewProps {
  feedback: RecallFeedback;
  onDeepDive: (question: string, answer: string) => Promise<string>;
  onBack: () => void;
}

export function FeedbackView({ feedback, onDeepDive, onBack }: FeedbackViewProps) {
  return (
    <div className="flex flex-col p-4 animate-fade-in">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          다시 학습하기
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">학습 결과</h2>

      {/* Score Card */}
      <div className="mb-6">
        <ScoreCard score={feedback.score} level={feedback.level} summary={feedback.summary} />
      </div>

      {/* Concept Sections */}
      <div className="space-y-4 mb-6">
        {/* Correct Concepts */}
        <ConceptSection
          title="잘 기억한 개념"
          icon="✅"
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/50"
          concepts={feedback.correctConcepts}
          defaultExpanded={true}
        />

        {/* Missed Concepts */}
        <ConceptSection
          title="놓친 개념"
          icon="💡"
          iconColor="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/50"
          concepts={feedback.missedConcepts}
          showHints={true}
          defaultExpanded={true}
        />

        {/* Incorrect Concepts */}
        <ConceptSection
          title="수정이 필요한 부분"
          icon="⚠️"
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/50"
          concepts={feedback.incorrectConcepts}
          defaultExpanded={true}
        />
      </div>

      {/* Deep Dive Questions */}
      <DeepDiveQuestion questions={feedback.deepDiveQuestions} onSubmitAnswer={onDeepDive} />

      {/* Retry Button */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          새로운 페이지 학습하기
        </button>
      </div>
    </div>
  );
}
