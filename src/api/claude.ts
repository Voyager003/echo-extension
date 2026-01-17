import type { ContentAnalysis } from '../types/analysis';
import type { RecallFeedback } from '../types/feedback';
import { ANALYZE_CONTENT_PROMPT, createCompareRecallPrompt, createDeepDivePrompt } from './prompts';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: 'text'; text: string }>;
  stop_reason: string;
}

async function callClaude(
  messages: ClaudeMessage[],
  apiKey: string,
  systemPrompt?: string
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  };

  const body: Record<string, unknown> = {
    model: MODEL,
    max_tokens: 4096,
    messages,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'API 호출에 실패했습니다.';

    if (response.status === 401) {
      errorMessage = 'API 키가 유효하지 않습니다. 설정에서 올바른 API 키를 입력해주세요.';
    } else if (response.status === 429) {
      errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
    } else if (response.status >= 500) {
      errorMessage = 'Claude 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    console.error('Claude API Error:', response.status, errorText);
    throw new Error(errorMessage);
  }

  const data: ClaudeResponse = await response.json();
  return data.content[0]?.text || '';
}

function parseJSON<T>(text: string): T {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  try {
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error('Failed to parse JSON:', text);
    throw new Error('응답을 파싱하는데 실패했습니다.');
  }
}

export async function analyzeContent(text: string, apiKey: string): Promise<ContentAnalysis> {
  const truncatedText = text.substring(0, 8000);

  const response = await callClaude(
    [{ role: 'user', content: `다음 텍스트를 분석해주세요:\n\n${truncatedText}` }],
    apiKey,
    ANALYZE_CONTENT_PROMPT
  );

  return parseJSON<ContentAnalysis>(response);
}

export async function compareRecall(
  originalText: string,
  userRecall: string,
  analysis: ContentAnalysis,
  apiKey: string
): Promise<RecallFeedback> {
  const prompt = createCompareRecallPrompt(originalText, userRecall, analysis);

  const response = await callClaude([{ role: 'user', content: prompt }], apiKey);

  return parseJSON<RecallFeedback>(response);
}

export async function answerDeepDive(
  question: string,
  userAnswer: string,
  context: string,
  apiKey: string
): Promise<string> {
  const prompt = createDeepDivePrompt(question, userAnswer, context);

  const response = await callClaude([{ role: 'user', content: prompt }], apiKey);

  return response;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    await callClaude(
      [{ role: 'user', content: 'Hi' }],
      apiKey,
      'Just respond with "OK" to verify the API key is working.'
    );
    return true;
  } catch {
    return false;
  }
}
