import React, { useState, useEffect } from 'react';

export function Options() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
    loadDarkMode();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'CHECK_AUTH' });
      setIsLoggedIn(response.isLoggedIn);
      setEmail(response.email || null);
    } catch (err) {
      console.error('Failed to check auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDarkMode = async () => {
    const result = await chrome.storage.sync.get('dark_mode');
    if (result.dark_mode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'LOGIN' });
      if (response.success) {
        await checkAuthStatus();
      } else {
        setError(response.error || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await chrome.runtime.sendMessage({ type: 'LOGOUT' });
      setIsLoggedIn(false);
      setEmail(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    chrome.storage.sync.set({ dark_mode: newDarkMode });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Echo 설정</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">확장 프로그램 설정을 관리합니다</p>
        </div>

        {/* Google Login Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Google 계정 연결</h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">연결됨</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{email}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Google 계정으로 로그인하면 Gemini AI를 사용하여 학습 피드백을 받을 수 있습니다.
              </p>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-200">Google로 로그인</span>
              </button>
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Gemini AI 사용</span>
              <br />
              Google의 Gemini Flash 모델을 사용하여 빠르고 정확한 피드백을 제공합니다.
              무료로 사용 가능합니다.
            </p>
          </div>
        </div>

        {/* Dark Mode Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">화면 설정</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">다크 모드</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">어두운 테마를 사용합니다</p>
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isDarkMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Echo v1.0.0</p>
          <p className="mt-1">Powered by Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}
