import type { ContentAnalysis } from './analysis';
import type { RecallFeedback } from './feedback';

export interface LearningRecord {
  id: string;
  createdAt: number;
  pageTitle: string;
  pageUrl: string;
  userRecall: string;
  analysis: ContentAnalysis;
  feedback: RecallFeedback;
}

export interface LearningHistory {
  records: LearningRecord[];
}
