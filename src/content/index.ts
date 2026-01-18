import { extractPageContent } from './extractor';
import type { Message, ExtractTextResultMessage } from '../types/messages';

// Listen for messages from background script or side panel
chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtractTextResultMessage) => void
  ) => {
    if (message.type === 'EXTRACT_TEXT') {
      try {
        const content = extractPageContent();

        sendResponse({
          type: 'EXTRACT_TEXT_RESULT',
          success: true,
          text: content.text,
          title: content.title,
          url: content.url,
        });
      } catch (error) {
        sendResponse({
          type: 'EXTRACT_TEXT_RESULT',
          success: false,
          error: error instanceof Error ? error.message : 'Failed to extract text',
        });
      }
    }

    // Return true to indicate async response
    return true;
  }
);
