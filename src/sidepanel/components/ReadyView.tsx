import React from 'react';

interface ReadyViewProps {
  onStartLearning: () => void;
}

export function ReadyView({ onStartLearning }: ReadyViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 animate-fade-in">
      <div className="w-20 h-20 mb-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Active Recall 학습
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-xs">
        페이지 내용을 읽은 후, 기억나는 내용을 적어보세요. AI가 피드백을 제공합니다.
      </p>

      <button
        onClick={onStartLearning}
        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
      >
        이 페이지 학습하기
      </button>

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">1</span>
          <span>페이지 내용 읽기</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">2</span>
          <span>기억나는 내용 작성</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">3</span>
          <span>AI 피드백 확인</span>
        </div>
      </div>
    </div>
  );
}
