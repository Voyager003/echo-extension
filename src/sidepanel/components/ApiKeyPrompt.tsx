import React, { useState } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

interface ApiKeyPromptProps {
  onApiKeySaved: () => void;
  onOpenSettings: () => void;
}

export function ApiKeyPrompt({ onApiKeySaved, onOpenSettings }: ApiKeyPromptProps) {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await chrome.storage.sync.set({ [API_KEY_STORAGE_KEY]: apiKey.trim() });
      onApiKeySaved();
    } catch (err) {
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 animate-fade-in">
      <div className="w-16 h-16 mb-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">API 키 설정</h2>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-xs">
        Echo를 사용하려면 Gemini API 키가 필요합니다.
      </p>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API 키를 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장하고 시작하기'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-xs">
        <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2 text-sm">API 키 발급 방법</h3>
        <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
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
          <li>생성된 키를 복사하여 위에 붙여넣기</li>
        </ol>
        <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">
          * 무료로 사용 가능합니다
        </p>
      </div>

      <button
        onClick={onOpenSettings}
        className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        설정 페이지에서 관리하기
      </button>
    </div>
  );
}
