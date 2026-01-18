import type { Message } from '../types/messages';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'google_access_token',
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
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) => {
    handleMessage(message, sendResponse);
    return true; // Keep message channel open for async response
  }
);

async function handleMessage(
  message: Message,
  sendResponse: (response: unknown) => void
): Promise<void> {
  switch (message.type) {
    case 'GET_AUTH_TOKEN':
      await handleGetAuthToken(sendResponse);
      break;

    case 'LOGIN':
      await handleLogin(sendResponse);
      break;

    case 'LOGOUT':
      await handleLogout(sendResponse);
      break;

    case 'CHECK_AUTH':
      await handleCheckAuth(sendResponse);
      break;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
}

async function handleGetAuthToken(
  sendResponse: (response: { success: boolean; token?: string; error?: string }) => void
): Promise<void> {
  try {
    const token = await getAuthToken(false);
    if (token) {
      sendResponse({ success: true, token });
    } else {
      sendResponse({ success: false, error: '로그인이 필요합니다.' });
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '인증 토큰을 가져오는데 실패했습니다.',
    });
  }
}

async function handleLogin(
  sendResponse: (response: { success: boolean; token?: string; error?: string }) => void
): Promise<void> {
  try {
    const token = await getAuthToken(true);
    if (token) {
      await chrome.storage.sync.set({ [STORAGE_KEYS.ACCESS_TOKEN]: token });
      sendResponse({ success: true, token });
    } else {
      sendResponse({ success: false, error: '로그인에 실패했습니다.' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
    });
  }
}

async function handleLogout(
  sendResponse: (response: { success: boolean; error?: string }) => void
): Promise<void> {
  try {
    // Get current token
    const result = await chrome.storage.sync.get(STORAGE_KEYS.ACCESS_TOKEN);
    const token = result[STORAGE_KEYS.ACCESS_TOKEN];

    if (token) {
      // Revoke the token
      await chrome.identity.removeCachedAuthToken({ token });
    }

    // Clear storage
    await chrome.storage.sync.remove(STORAGE_KEYS.ACCESS_TOKEN);

    sendResponse({ success: true });
  } catch (error) {
    console.error('Logout failed:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
    });
  }
}

async function handleCheckAuth(
  sendResponse: (response: { isLoggedIn: boolean; email?: string }) => void
): Promise<void> {
  try {
    const token = await getAuthToken(false);
    if (token) {
      // Get user info
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userInfo = await response.json();
        sendResponse({ isLoggedIn: true, email: userInfo.email });
        return;
      }
    }
    sendResponse({ isLoggedIn: false });
  } catch (error) {
    console.error('Check auth failed:', error);
    sendResponse({ isLoggedIn: false });
  }
}

function getAuthToken(interactive: boolean): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) {
        if (interactive) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(undefined);
        }
        return;
      }
      resolve(token);
    });
  });
}

// Log that background script is loaded
console.log('[Echo] Background service worker loaded');
