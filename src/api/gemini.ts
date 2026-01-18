import type { ContentAnalysis } from '../types/analysis';
import type { RecallFeedback } from '../types/feedback';
import { ANALYZE_CONTENT_PROMPT, createCompareRecallPrompt, createDeepDivePrompt } from './prompts';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

async function callGemini(
  prompt: string,
  apiKey: string,
  systemInstruction?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const url = `${GEMINI_API_BASE}?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', response.status, errorText);

    let errorDetail = '';
    try {
      const errorJson = JSON.parse(errorText);
      errorDetail = errorJson.error?.message || errorText;
    } catch {
      errorDetail = errorText;
    }

    if (response.status === 400) {
      throw new Error('API 키가 유효하지 않습니다. 설정에서 올바른 API 키를 입력해주세요.');
    } else if (response.status === 429) {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
    } else if (response.status >= 500) {
      throw new Error('Gemini 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    throw new Error(`[${response.status}] ${errorDetail}`);
  }

  const data: GeminiResponse = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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

  const response = await callGemini(
    `다음 텍스트를 분석해주세요:\n\n${truncatedText}`,
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

  const response = await callGemini(prompt, apiKey);

  return parseJSON<RecallFeedback>(response);
}

export async function answerDeepDive(
  question: string,
  userAnswer: string,
  context: string,
  apiKey: string
): Promise<string> {
  const prompt = createDeepDivePrompt(question, userAnswer, context);

  const response = await callGemini(prompt, apiKey);

  return response;
}
