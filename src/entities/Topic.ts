import { Concept } from './Concept';
import { Domain } from './Domain';
import { LearningGoal } from './LearningGoal';

export const TopicLabel = 'Topic';

export interface BaseTopic {
  _id: string;
  name: string;
  key: string;
  description?: string;
  topicType: TopicType;
}

export type Topic = Domain | Concept | LearningGoal | BaseTopic;

export enum TopicType {
  Domain = 'Domain',
  Concept = 'Concept',
  LearningGoal = 'LearningGoal',
}
