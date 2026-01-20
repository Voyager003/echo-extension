import React, { useCallback, useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/Header';
import { ReadyView } from './components/ReadyView';
import { LoadingView } from './components/LoadingView';
import { WritingView } from './components/WritingView';
import { ErrorView } from './components/ErrorView';
import { FeedbackView } from './components/FeedbackView';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { HistoryView } from './components/HistoryView';
import { HistoryDetailView } from './components/HistoryDetailView';
import { analyzeContent, compareRecall, answerDeepDive } from '../api/gemini';
import { saveLearningRecord } from './utils/storage';
import type { LearningRecord } from '../types/history';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function App() {
  const { state, actions } = useAppState();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LearningRecord | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const result = await chrome.storage.sync.get(API_KEY_STORAGE_KEY);
    setHasApiKey(!!result[API_KEY_STORAGE_KEY]);
  };

  const getApiKey = async (): Promise<string | null> => {
    const result = await chrome.storage.sync.get(API_KEY_STORAGE_KEY);
    return result[API_KEY_STORAGE_KEY] || null;
  };

  const handleStartLearning = useCallback(async () => {
    actions.startLearning();

    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        actions.setError('활성 탭을 찾을 수 없습니다.');
        return;
      }

      // Extract text from page
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_TEXT' });

      if (!response.success) {
        actions.setError(response.error || '텍스트 추출에 실패했습니다.');
        return;
      }

      if (!response.text || response.text.trim().length < 100) {
        actions.setError('페이지에서 충분한 텍스트를 찾을 수 없습니다.');
        return;
      }

      actions.setPageContent(response.title || '제목 없음', response.url || '', response.text);

      // Get API key
      const apiKey = await getApiKey();
      if (!apiKey) {
        actions.setError('API 키가 필요합니다. 설정에서 Gemini API 키를 입력해주세요.');
        setHasApiKey(false);
        return;
      }

      const analysis = await analyzeContent(response.text, apiKey);
      actions.setAnalysis(analysis);
      actions.startWriting();
    } catch (error) {
      actions.setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  }, [actions]);

  const handleSubmitRecall = useCallback(
    async (userRecall: string) => {
      actions.setUserRecall(userRecall);
      actions.startAnalyzing();

      try {
        const apiKey = await getApiKey();
        if (!apiKey) {
          actions.setError('API 키가 필요합니다.');
          setHasApiKey(false);
          return;
        }

        if (!state.analysis) {
          actions.setError('분석 데이터가 없습니다.');
          return;
        }

        const feedback = await compareRecall(state.originalText, userRecall, state.analysis, apiKey);
        actions.setFeedback(feedback);
        actions.showFeedback();
      } catch (error) {
        actions.setError(error instanceof Error ? error.message : '피드백 생성에 실패했습니다.');
      }
    },
    [actions, state.analysis, state.originalText]
  );

  const handleDeepDive = useCallback(
    async (question: string, answer: string): Promise<string> => {
      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error('API 키가 필요합니다.');
      }

      return answerDeepDive(question, answer, state.originalText, apiKey);
    },
    [state.originalText]
  );

  const handleOpenSettings = useCallback(() => {
    chrome.runtime.openOptionsPage();
  }, []);

  const handleRetry = useCallback(() => {
    actions.reset();
    handleStartLearning();
  }, [actions, handleStartLearning]);

  const handleBack = useCallback(() => {
    actions.reset();
  }, [actions]);

  const handleApiKeySaved = useCallback(() => {
    setHasApiKey(true);
  }, []);

  const handleSaveRecord = useCallback(async () => {
    if (!state.analysis || !state.feedback) return;

    await saveLearningRecord(
      state.pageTitle,
      state.pageUrl,
      state.userRecall,
      state.analysis,
      state.feedback
    );
  }, [state.pageTitle, state.pageUrl, state.userRecall, state.analysis, state.feedback]);

  const handleViewHistory = useCallback(() => {
    actions.setView('history');
  }, [actions]);

  const handleViewRecord = useCallback((record: LearningRecord) => {
    setSelectedRecord(record);
    actions.setView('historyDetail');
  }, [actions]);

  const handleBackFromHistory = useCallback(() => {
    actions.reset();
  }, [actions]);

  const handleBackFromDetail = useCallback(() => {
    setSelectedRecord(null);
    actions.setView('history');
  }, [actions]);

  // Show loading while checking API key
  if (hasApiKey === null) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <Header
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={actions.toggleDarkMode}
          onOpenSettings={handleOpenSettings}
        />
        <main className="flex-1 overflow-auto">
          <LoadingView message="로딩 중..." />
        </main>
      </div>
    );
  }

  // Show API key prompt if not set
  if (!hasApiKey) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <Header
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={actions.toggleDarkMode}
          onOpenSettings={handleOpenSettings}
        />
        <main className="flex-1 overflow-auto">
          <ApiKeyPrompt onApiKeySaved={handleApiKeySaved} onOpenSettings={handleOpenSettings} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header
        isDarkMode={state.isDarkMode}
        onToggleDarkMode={actions.toggleDarkMode}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex-1 overflow-auto">
        {state.view === 'ready' && (
          <ReadyView onStartLearning={handleStartLearning} onViewHistory={handleViewHistory} />
        )}

        {state.view === 'loading' && <LoadingView message="페이지 내용을 분석 중..." />}

        {state.view === 'writing' && (
          <WritingView pageTitle={state.pageTitle} onSubmit={handleSubmitRecall} onBack={handleBack} />
        )}

        {state.view === 'analyzing' && <LoadingView message="AI가 피드백을 생성 중..." />}

        {state.view === 'feedback' && state.feedback && (
          <FeedbackView
            feedback={state.feedback}
            onDeepDive={handleDeepDive}
            onBack={handleBack}
            onSave={handleSaveRecord}
          />
        )}

        {state.view === 'error' && (
          <ErrorView error={state.error || '알 수 없는 오류'} onRetry={handleRetry} onBack={handleBack} />
        )}

        {state.view === 'history' && (
          <HistoryView onBack={handleBackFromHistory} onViewRecord={handleViewRecord} />
        )}

        {state.view === 'historyDetail' && selectedRecord && (
          <HistoryDetailView record={selectedRecord} onBack={handleBackFromDetail} />
        )}
      </main>
    </div>
  );
}
