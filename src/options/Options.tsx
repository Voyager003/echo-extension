import React, { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export function Options() {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await chrome.storage.sync.get([API_KEY_STORAGE_KEY, 'dark_mode']);
    if (result[API_KEY_STORAGE_KEY]) {
      setSavedApiKey(result[API_KEY_STORAGE_KEY]);
      setApiKey(result[API_KEY_STORAGE_KEY]);
    }
    if (result.dark_mode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API 키를 입력해주세요.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await chrome.storage.sync.set({ [API_KEY_STORAGE_KEY]: apiKey.trim() });
      setSavedApiKey(apiKey.trim());
      setMessage({ type: 'success', text: 'API 키가 저장되었습니다.' });
    } catch (err) {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = async () => {
    try {
      await chrome.storage.sync.remove(API_KEY_STORAGE_KEY);
      setApiKey('');
      setSavedApiKey('');
      setMessage({ type: 'success', text: 'API 키가 삭제되었습니다.' });
    } catch (err) {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
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

        {/* API Key Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gemini API 키</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API 키
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API 키를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              {savedApiKey && (
                <button
                  onClick={handleDeleteApiKey}
                  className="px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* API Key Guide */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">API 키 발급 방법</h3>
            <ol className="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Google AI Studio
                </a>
                에 접속
              </li>
              <li>Google 계정으로 로그인</li>
              <li>"Create API Key" 클릭</li>
              <li>생성된 API 키를 복사하여 위에 붙여넣기</li>
            </ol>
            <p className="mt-3 text-xs text-blue-500 dark:text-blue-400">
              * Gemini Flash는 무료로 사용 가능합니다 (분당 15회, 일 1,500회)
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
