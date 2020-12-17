import { Concept, ConceptLabel } from './Concept';
import { Domain, DomainLabel } from './Domain';
import { LearningGoal, LearningGoalLabel } from './LearningGoal';

export const TopicLabel = 'Topic';

export interface BaseTopic {
  _id: string;
  name: string;
  key?: string;
  description?: string;
}

export type Topic = Domain | Concept | LearningGoal;

export type TopicType = typeof DomainLabel | typeof ConceptLabel | typeof LearningGoalLabel;
