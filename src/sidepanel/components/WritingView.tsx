import React, { useState } from 'react';

interface WritingViewProps {
  pageTitle: string;
  onSubmit: (text: string) => void;
  onBack: () => void;
}

export function WritingView({ pageTitle, onSubmit, onBack }: WritingViewProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full p-4 animate-fade-in">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          기억나는 내용을 작성하세요
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={pageTitle}>
          📄 {pageTitle}
        </p>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="페이지에서 읽은 내용 중 기억나는 것들을 자유롭게 적어주세요. 완벽하지 않아도 괜찮습니다!"
          className="w-full h-full min-h-[250px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {wordCount} 단어
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          피드백 받기
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Tip: 핵심 개념, 중요한 사실, 배운 내용을 자유롭게 적어보세요
      </p>
    </div>
  );
}
