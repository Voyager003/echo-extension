import type { LearningRecord, LearningHistory } from '../../types/history';
import type { ContentAnalysis } from '../../types/analysis';
import type { RecallFeedback } from '../../types/feedback';

const HISTORY_STORAGE_KEY = 'learning_history';

export async function saveLearningRecord(
  pageTitle: string,
  pageUrl: string,
  userRecall: string,
  analysis: ContentAnalysis,
  feedback: RecallFeedback
): Promise<LearningRecord> {
  const history = await getLearningHistory();

  const newRecord: LearningRecord = {
    id: generateId(),
    createdAt: Date.now(),
    pageTitle,
    pageUrl,
    userRecall,
    analysis,
    feedback,
  };

  history.records.unshift(newRecord);

  await chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: history });

  return newRecord;
}

export async function getLearningHistory(): Promise<LearningHistory> {
  const result = await chrome.storage.local.get(HISTORY_STORAGE_KEY);
  return result[HISTORY_STORAGE_KEY] || { records: [] };
}

export async function deleteLearningRecord(id: string): Promise<void> {
  const history = await getLearningHistory();
  history.records = history.records.filter((record) => record.id !== id);
  await chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: history });
}

export async function clearAllHistory(): Promise<void> {
  await chrome.storage.local.remove(HISTORY_STORAGE_KEY);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
