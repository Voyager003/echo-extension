import React, { useState, useEffect } from 'react';
import type { LearningRecord } from '../../types/history';
import { getLearningHistory, deleteLearningRecord } from '../utils/storage';
import { FEEDBACK_LEVEL_CONFIG } from '../../types/feedback';

interface HistoryViewProps {
  onBack: () => void;
  onViewRecord: (record: LearningRecord) => void;
}

export function HistoryView({ onBack, onViewRecord }: HistoryViewProps) {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const history = await getLearningHistory();
    setRecords(history.records);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      await deleteLearningRecord(id);
      await loadHistory();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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
          돌아가기
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">학습 기록</h2>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">아직 학습 기록이 없습니다</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">학습을 완료하면 여기에 기록됩니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const levelConfig = FEEDBACK_LEVEL_CONFIG[record.feedback.level];
            return (
              <div
                key={record.id}
                onClick={() => onViewRecord(record)}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{record.pageTitle}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(record.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${levelConfig.color}`}>
                      {record.feedback.score}점
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, record.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {record.userRecall}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
