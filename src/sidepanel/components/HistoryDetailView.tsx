import React from 'react';
import type { LearningRecord } from '../../types/history';
import { ScoreCard } from './ScoreCard';
import { ConceptSection } from './ConceptSection';

interface HistoryDetailViewProps {
  record: LearningRecord;
  onBack: () => void;
}

export function HistoryDetailView({ record, onBack }: HistoryDetailViewProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          기록 목록으로
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{record.pageTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(record.createdAt)}</p>
        {record.pageUrl && (
          <a
            href={record.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-500 hover:text-primary-600 mt-1 inline-block"
          >
            원본 페이지 열기 →
          </a>
        )}
      </div>

      {/* Score Card */}
      <div className="mb-6">
        <ScoreCard score={record.feedback.score} level={record.feedback.level} summary={record.feedback.summary} />
      </div>

      {/* User Recall */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">내가 작성한 내용</h3>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{record.userRecall}</p>
        </div>
      </div>

      {/* Concept Sections */}
      <div className="space-y-4">
        <ConceptSection
          title="잘 기억한 개념"
          icon="✅"
          iconColor="text-green-600 dark:text-green-400"
          bgColor="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/50"
          concepts={record.feedback.correctConcepts}
          defaultExpanded={false}
        />

        <ConceptSection
          title="놓친 개념"
          icon="💡"
          iconColor="text-yellow-600 dark:text-yellow-400"
          bgColor="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/50"
          concepts={record.feedback.missedConcepts}
          showHints={true}
          defaultExpanded={false}
        />

        <ConceptSection
          title="수정이 필요한 부분"
          icon="⚠️"
          iconColor="text-orange-600 dark:text-orange-400"
          bgColor="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/50"
          concepts={record.feedback.incorrectConcepts}
          defaultExpanded={false}
        />
      </div>
    </div>
  );
}
