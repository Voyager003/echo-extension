import { useState, useCallback } from 'react';
import type { ContentAnalysis } from '../../types/analysis';
import type { RecallFeedback } from '../../types/feedback';

export type AppView = 'ready' | 'loading' | 'writing' | 'analyzing' | 'feedback' | 'error' | 'history' | 'historyDetail';

export interface AppState {
  view: AppView;
  pageTitle: string;
  pageUrl: string;
  originalText: string;
  userRecall: string;
  analysis: ContentAnalysis | null;
  feedback: RecallFeedback | null;
  error: string | null;
  isDarkMode: boolean;
}

const initialState: AppState = {
  view: 'ready',
  pageTitle: '',
  pageUrl: '',
  originalText: '',
  userRecall: '',
  analysis: null,
  feedback: null,
  error: null,
  isDarkMode: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const setView = useCallback((view: AppView) => {
    setState((prev) => ({ ...prev, view }));
  }, []);

  const setPageContent = useCallback((title: string, url: string, text: string) => {
    setState((prev) => ({
      ...prev,
      pageTitle: title,
      pageUrl: url,
      originalText: text,
    }));
  }, []);

  const setUserRecall = useCallback((userRecall: string) => {
    setState((prev) => ({ ...prev, userRecall }));
  }, []);

  const setAnalysis = useCallback((analysis: ContentAnalysis) => {
    setState((prev) => ({ ...prev, analysis }));
  }, []);

  const setFeedback = useCallback((feedback: RecallFeedback) => {
    setState((prev) => ({ ...prev, feedback }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, view: error ? 'error' : prev.view }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState((prev) => {
      const newDarkMode = !prev.isDarkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, isDarkMode: newDarkMode };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    document.documentElement.classList.remove('dark');
  }, []);

  const startLearning = useCallback(() => {
    setState((prev) => ({ ...prev, view: 'loading' }));
  }, []);

  const startWriting = useCallback(() => {
    setState((prev) => ({ ...prev, view: 'writing' }));
  }, []);

  const startAnalyzing = useCallback(() => {
    setState((prev) => ({ ...prev, view: 'analyzing' }));
  }, []);

  const showFeedback = useCallback(() => {
    setState((prev) => ({ ...prev, view: 'feedback' }));
  }, []);

  return {
    state,
    actions: {
      setView,
      setPageContent,
      setUserRecall,
      setAnalysis,
      setFeedback,
      setError,
      toggleDarkMode,
      reset,
      startLearning,
      startWriting,
      startAnalyzing,
      showFeedback,
    },
  };
}
