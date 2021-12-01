export const TopicLabel = 'Topic';

export interface Topic {
  _id: string;
  name: string;
  key: string;
  context?: string;
  isDisambiguation?: boolean;
  description?: string;
  updatedAt: number;
  createdAt: number;
}
