import type { ContentAnalysis } from '../types/analysis';

export const ANALYZE_CONTENT_PROMPT = `당신은 학습 콘텐츠를 분석하는 전문가입니다. 주어진 웹페이지 텍스트를 분석하여 핵심 개념과 주요 아이디어를 추출해주세요.

다음 형식으로 JSON을 반환해주세요:
{
  "keyConcepts": [
    {
      "name": "개념 이름",
      "description": "개념에 대한 간단한 설명",
      "importance": "high" | "medium" | "low"
    }
  ],
  "mainIdeas": ["주요 아이디어 1", "주요 아이디어 2", ...],
  "summary": "전체 내용의 2-3문장 요약"
}

분석 시 주의사항:
- keyConcepts는 최대 10개까지만 추출
- 각 개념의 importance는 해당 내용에서의 중요도를 나타냄
- mainIdeas는 5-7개의 핵심 포인트로 정리
- summary는 전체 맥락을 이해할 수 있는 간결한 요약

JSON만 반환하세요. 추가 설명은 포함하지 마세요.`;

export function createCompareRecallPrompt(
  originalText: string,
  userRecall: string,
  analysis: ContentAnalysis
): string {
  return `당신은 학습 피드백을 제공하는 교육 전문가입니다. 사용자가 웹페이지를 읽고 기억나는 내용을 작성했습니다. 원본 텍스트와 비교하여 피드백을 제공해주세요.

## 원본 텍스트
${originalText.substring(0, 3000)}${originalText.length > 3000 ? '...(생략)' : ''}

## 핵심 개념 분석
${JSON.stringify(analysis.keyConcepts, null, 2)}

## 주요 아이디어
${analysis.mainIdeas.join('\n- ')}

## 사용자가 작성한 내용
${userRecall}

---

다음 형식으로 JSON을 반환해주세요:
{
  "score": 0-100 사이의 점수,
  "level": "excellent" | "good" | "fair" | "needs_work",
  "summary": "전체적인 피드백 요약 (2-3문장)",
  "correctConcepts": [
    {
      "concept": "사용자가 정확히 기억한 개념",
      "explanation": "칭찬과 함께 왜 중요한지 설명"
    }
  ],
  "missedConcepts": [
    {
      "concept": "놓친 중요 개념",
      "explanation": "이 개념이 왜 중요한지",
      "hint": "기억을 되살리는 힌트"
    }
  ],
  "incorrectConcepts": [
    {
      "concept": "부정확하게 기억한 부분",
      "explanation": "올바른 내용과 어떻게 다른지"
    }
  ],
  "deepDiveQuestions": [
    {
      "question": "더 깊이 생각해볼 질문",
      "relatedConcept": "관련된 핵심 개념"
    }
  ]
}

채점 기준:
- excellent (90-100): 대부분의 핵심 개념을 정확히 기억
- good (70-89): 주요 개념을 기억하지만 일부 누락
- fair (50-69): 기본 개념은 이해하지만 세부사항 부족
- needs_work (0-49): 주요 개념 대부분 누락 또는 오해

피드백 작성 시 주의사항:
- 긍정적이고 격려하는 톤 유지
- 구체적인 예시와 함께 설명
- deepDiveQuestions는 2-3개만 제공
- 사용자가 작성하지 않은 내용은 missedConcepts에 포함

JSON만 반환하세요. 추가 설명은 포함하지 마세요.`;
}

export function createDeepDivePrompt(question: string, userAnswer: string, context: string): string {
  return `당신은 학습을 돕는 튜터입니다. 심화 질문에 대한 사용자의 답변을 평가해주세요.

## 원본 내용 (맥락)
${context.substring(0, 2000)}

## 심화 질문
${question}

## 사용자 답변
${userAnswer}

---

다음을 포함하여 2-3문장으로 피드백을 제공해주세요:
1. 답변의 정확성 평가
2. 보완하면 좋을 내용
3. 격려의 말

단, 새로운 심화 질문은 제시하지 마세요. 피드백 텍스트만 반환하세요.`;
}
