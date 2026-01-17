import React, { useCallback } from 'react';
import { useAppState } from './hooks/useAppState';
import { Header } from './components/Header';
import { ReadyView } from './components/ReadyView';
import { LoadingView } from './components/LoadingView';
import { WritingView } from './components/WritingView';
import { ErrorView } from './components/ErrorView';
import { FeedbackView } from './components/FeedbackView';
import { analyzeContent, compareRecall, answerDeepDive } from '../api/claude';

export function App() {
  const { state, actions } = useAppState();

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

      // Analyze content
      const apiKey = await getApiKey();
      if (!apiKey) {
        actions.setError('API 키가 설정되지 않았습니다. 설정에서 Claude API 키를 입력해주세요.');
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
          actions.setError('API 키가 설정되지 않았습니다.');
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
        throw new Error('API 키가 설정되지 않았습니다.');
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

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header
        isDarkMode={state.isDarkMode}
        onToggleDarkMode={actions.toggleDarkMode}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex-1 overflow-auto">
        {state.view === 'ready' && <ReadyView onStartLearning={handleStartLearning} />}

        {state.view === 'loading' && <LoadingView message="페이지 내용을 분석 중..." />}

        {state.view === 'writing' && (
          <WritingView pageTitle={state.pageTitle} onSubmit={handleSubmitRecall} onBack={handleBack} />
        )}

        {state.view === 'analyzing' && <LoadingView message="AI가 피드백을 생성 중..." />}

        {state.view === 'feedback' && state.feedback && (
          <FeedbackView feedback={state.feedback} onDeepDive={handleDeepDive} onBack={handleBack} />
        )}

        {state.view === 'error' && (
          <ErrorView error={state.error || '알 수 없는 오류'} onRetry={handleRetry} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}

async function getApiKey(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.sync.get('claude_api_key', (result) => {
      resolve(result.claude_api_key || null);
    });
  });
}
