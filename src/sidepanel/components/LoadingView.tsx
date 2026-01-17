import React from 'react';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = '페이지 분석 중...' }: LoadingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>

      <div className="mt-6 w-full max-w-xs space-y-3">
        <div className="h-4 loading-shimmer rounded"></div>
        <div className="h-4 loading-shimmer rounded w-3/4"></div>
        <div className="h-4 loading-shimmer rounded w-1/2"></div>
      </div>
    </div>
  );
}
