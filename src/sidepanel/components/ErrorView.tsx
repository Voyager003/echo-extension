import React from 'react';

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export function ErrorView({ error, onRetry, onBack }: ErrorViewProps) {
  const isApiKeyError = error.toLowerCase().includes('api') || error.toLowerCase().includes('key');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 animate-fade-in">
      <div className="w-16 h-16 mb-6 bg-danger-50 dark:bg-danger-500/10 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        오류가 발생했습니다
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-xs">
        {error}
      </p>

      {isApiKeyError && (
        <div className="mb-6 p-4 bg-warning-50 dark:bg-warning-500/10 rounded-lg text-sm text-warning-600 dark:text-warning-500">
          <p className="font-medium mb-1">API 키가 필요합니다</p>
          <p>설정에서 Claude API 키를 입력해주세요.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          처음으로
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
