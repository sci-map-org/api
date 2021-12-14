export const TopicLabel = 'Topic';

export interface Topic {
  _id: string;
  name: string;
  key: string;
  aliasesJson?: string; // parsed as json in order to have full text search on it
  context?: string;
  isDisambiguation?: boolean;
  description?: string;
  updatedAt: number;
  createdAt: number;
}
