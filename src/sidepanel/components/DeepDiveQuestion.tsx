import React, { useState } from 'react';
import type { DeepDiveQuestion as DeepDiveQuestionType } from '../../types/feedback';

interface DeepDiveQuestionProps {
  questions: DeepDiveQuestionType[];
  onSubmitAnswer: (question: string, answer: string) => Promise<string>;
}

export function DeepDiveQuestion({ questions, onSubmitAnswer }: DeepDiveQuestionProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<number | null>(null);

  if (questions.length === 0) return null;

  const handleSubmit = async (index: number, question: string) => {
    const answer = answers[index]?.trim();
    if (!answer) return;

    setLoading(index);
    try {
      const feedback = await onSubmitAnswer(question, answer);
      setFeedbacks((prev) => ({ ...prev, [index]: feedback }));
    } catch (error) {
      setFeedbacks((prev) => ({
        ...prev,
        [index]: '피드백을 가져오는데 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-xl border border-primary-100 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10 overflow-hidden">
      <div className="p-4 border-b border-primary-100 dark:border-primary-900/50">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <span className="font-medium text-gray-900 dark:text-white">심화 학습 질문</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          더 깊이 생각해볼 질문들입니다. 답변을 작성하면 AI가 피드백을 제공합니다.
        </p>
      </div>

      <div className="p-4 space-y-3">
        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{q.question}</p>
                  <p className="text-xs text-primary-500 mt-1">관련: {q.relatedConcept}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedQuestion === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedQuestion === index && (
              <div className="px-4 pb-4 animate-fade-in">
                {feedbacks[index] ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">AI 피드백:</span> {feedbacks[index]}
                    </p>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={answers[index] || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [index]: e.target.value }))}
                      placeholder="여기에 답변을 작성해주세요..."
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      disabled={loading === index}
                    />
                    <button
                      onClick={() => handleSubmit(index, q.question)}
                      disabled={!answers[index]?.trim() || loading === index}
                      className="mt-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading === index ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          분석 중...
                        </>
                      ) : (
                        '피드백 받기'
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
