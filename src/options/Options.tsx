import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../api/claude';

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export function Options() {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['claude_api_key', 'dark_mode'], (result) => {
      if (result.claude_api_key) {
        setApiKey(result.claude_api_key);
        setSavedApiKey(result.claude_api_key);
      }
      if (result.dark_mode) {
        setIsDarkMode(result.dark_mode);
        document.documentElement.classList.add('dark');
      }
    });
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('API 키를 입력해주세요.');
      setStatus('error');
      return;
    }

    setStatus('saving');
    setValidationStatus('validating');
    setErrorMessage('');

    try {
      // Validate the API key
      const isValid = await validateApiKey(apiKey.trim());

      if (!isValid) {
        setValidationStatus('invalid');
        setErrorMessage('API 키가 유효하지 않습니다. 올바른 키를 입력해주세요.');
        setStatus('error');
        return;
      }

      setValidationStatus('valid');

      // Save the API key
      await chrome.storage.sync.set({ claude_api_key: apiKey.trim() });
      setSavedApiKey(apiKey.trim());
      setStatus('saved');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setValidationStatus('invalid');
      setErrorMessage('API 키 검증 중 오류가 발생했습니다.');
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

  const handleDeleteApiKey = async () => {
    if (confirm('API 키를 삭제하시겠습니까?')) {
      await chrome.storage.sync.remove('claude_api_key');
      setApiKey('');
      setSavedApiKey('');
      setValidationStatus('idle');
      setStatus('idle');
    }
  };

  const maskedApiKey = savedApiKey
    ? `${savedApiKey.substring(0, 10)}${'*'.repeat(20)}${savedApiKey.substring(savedApiKey.length - 4)}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">AR</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Recall 설정</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">확장 프로그램 설정을 관리합니다</p>
        </div>

        {/* API Key Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Claude API 키</h2>

          {savedApiKey && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">API 키가 설정되어 있습니다</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-mono mt-1">{maskedApiKey}</p>
                </div>
                <button
                  onClick={handleDeleteApiKey}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  삭제
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {savedApiKey ? '새 API 키로 변경' : 'API 키 입력'}
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationStatus('idle');
                  setStatus('idle');
                  setErrorMessage('');
                }}
                placeholder="sk-ant-api..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            {validationStatus === 'valid' && status === 'saved' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">✓ API 키가 저장되었습니다!</p>
              </div>
            )}

            <button
              onClick={handleSaveApiKey}
              disabled={status === 'saving' || !apiKey.trim()}
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {validationStatus === 'validating' ? '검증 중...' : '저장 중...'}
                </>
              ) : (
                '저장'
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">API 키가 없으신가요?</span>
              <br />
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600"
              >
                Anthropic Console
              </a>
              에서 API 키를 발급받을 수 있습니다.
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
          <p>Active Recall v1.0.0</p>
          <p className="mt-1">AI 기반 능동 학습 확장 프로그램</p>
        </div>
      </div>
    </div>
  );
}
