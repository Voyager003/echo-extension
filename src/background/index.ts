import type { Message, GetApiKeyResultMessage } from '../types/messages';

// Storage keys
const STORAGE_KEYS = {
  API_KEY: 'claude_api_key',
  DARK_MODE: 'dark_mode',
} as const;

// Open side panel when action button is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Set up side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);

// Handle messages from content scripts and side panel
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => {
    handleMessage(message, sender, sendResponse);
    return true; // Keep message channel open for async response
  }
);

async function handleMessage(
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
): Promise<void> {
  switch (message.type) {
    case 'GET_API_KEY':
      await handleGetApiKey(sendResponse);
      break;

    case 'SAVE_API_KEY':
      await handleSaveApiKey(message.apiKey, sendResponse);
      break;

    default:
      // For other message types, we don't handle them in background
      sendResponse({ success: false, error: 'Unknown message type' });
  }
}

async function handleGetApiKey(sendResponse: (response: GetApiKeyResultMessage) => void): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.API_KEY);
    sendResponse({
      type: 'GET_API_KEY_RESULT',
      apiKey: result[STORAGE_KEYS.API_KEY] || undefined,
    });
  } catch (error) {
    console.error('Failed to get API key:', error);
    sendResponse({
      type: 'GET_API_KEY_RESULT',
      apiKey: undefined,
    });
  }
}

async function handleSaveApiKey(
  apiKey: string,
  sendResponse: (response: { success: boolean; error?: string }) => void
): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEYS.API_KEY]: apiKey });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Failed to save API key:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save API key',
    });
  }
}

// Log that background script is loaded
console.log('[Active Recall] Background service worker loaded');
