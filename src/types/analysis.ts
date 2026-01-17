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
