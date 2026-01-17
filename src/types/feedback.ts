export interface RecallFeedback {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'needs_work';
  summary: string;
  correctConcepts: ConceptFeedback[];
  missedConcepts: ConceptFeedback[];
  incorrectConcepts: ConceptFeedback[];
  deepDiveQuestions: DeepDiveQuestion[];
}

export interface ConceptFeedback {
  concept: string;
  explanation: string;
  hint?: string;
}

export interface DeepDiveQuestion {
  question: string;
  relatedConcept: string;
}

export type FeedbackLevel = 'excellent' | 'good' | 'fair' | 'needs_work';

export const FEEDBACK_LEVEL_CONFIG: Record<
  FeedbackLevel,
  { label: string; color: string; emoji: string }
> = {
  excellent: { label: '훌륭해요!', color: 'text-green-500', emoji: '🎉' },
  good: { label: '잘했어요!', color: 'text-blue-500', emoji: '👍' },
  fair: { label: '괜찮아요', color: 'text-yellow-500', emoji: '💪' },
  needs_work: { label: '더 연습해봐요', color: 'text-orange-500', emoji: '📚' },
};
