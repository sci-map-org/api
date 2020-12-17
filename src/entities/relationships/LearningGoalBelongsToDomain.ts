import { TopicBelongsToDomain, TopicBelongsToDomainLabel } from './TopicBelongsToDomain';

export const LearningGoalBelongsToDomainLabel = TopicBelongsToDomainLabel;

export interface LearningGoalBelongsToDomain extends TopicBelongsToDomain {
  contextualKey: string;
  contextualName: string;
}
