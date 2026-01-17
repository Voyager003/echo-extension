export type MessageType =
  | 'EXTRACT_TEXT'
  | 'EXTRACT_TEXT_RESULT'
  | 'ANALYZE_CONTENT'
  | 'ANALYZE_CONTENT_RESULT'
  | 'COMPARE_RECALL'
  | 'COMPARE_RECALL_RESULT'
  | 'GET_API_KEY'
  | 'GET_API_KEY_RESULT'
  | 'SAVE_API_KEY'
  | 'DEEP_DIVE_QUESTION'
  | 'DEEP_DIVE_ANSWER';

export interface BaseMessage {
  type: MessageType;
}

export interface ExtractTextMessage extends BaseMessage {
  type: 'EXTRACT_TEXT';
}

export interface ExtractTextResultMessage extends BaseMessage {
  type: 'EXTRACT_TEXT_RESULT';
  success: boolean;
  text?: string;
  title?: string;
  url?: string;
  error?: string;
}

export interface AnalyzeContentMessage extends BaseMessage {
  type: 'ANALYZE_CONTENT';
  text: string;
}

export interface AnalyzeContentResultMessage extends BaseMessage {
  type: 'ANALYZE_CONTENT_RESULT';
  success: boolean;
  analysis?: ContentAnalysis;
  error?: string;
}

export interface CompareRecallMessage extends BaseMessage {
  type: 'COMPARE_RECALL';
  originalText: string;
  userRecall: string;
  analysis: ContentAnalysis;
}

export interface CompareRecallResultMessage extends BaseMessage {
  type: 'COMPARE_RECALL_RESULT';
  success: boolean;
  feedback?: RecallFeedback;
  error?: string;
}

export interface GetApiKeyMessage extends BaseMessage {
  type: 'GET_API_KEY';
}

export interface GetApiKeyResultMessage extends BaseMessage {
  type: 'GET_API_KEY_RESULT';
  apiKey?: string;
}

export interface SaveApiKeyMessage extends BaseMessage {
  type: 'SAVE_API_KEY';
  apiKey: string;
}

export interface DeepDiveQuestionMessage extends BaseMessage {
  type: 'DEEP_DIVE_QUESTION';
  question: string;
  userAnswer: string;
  context: string;
}

export interface DeepDiveAnswerMessage extends BaseMessage {
  type: 'DEEP_DIVE_ANSWER';
  success: boolean;
  feedback?: string;
  error?: string;
}

export type Message =
  | ExtractTextMessage
  | ExtractTextResultMessage
  | AnalyzeContentMessage
  | AnalyzeContentResultMessage
  | CompareRecallMessage
  | CompareRecallResultMessage
  | GetApiKeyMessage
  | GetApiKeyResultMessage
  | SaveApiKeyMessage
  | DeepDiveQuestionMessage
  | DeepDiveAnswerMessage;

// Re-export for convenience
export interface ContentAnalysis {
  keyConcepts: KeyConcept[];
  mainIdeas: string[];
  summary: string;
}

export interface KeyConcept {
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

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
