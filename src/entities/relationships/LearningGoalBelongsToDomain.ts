import { BaseTopicBelongsToDomain, TopicBelongsToDomainLabel } from './TopicBelongsToDomain';

export const LearningGoalBelongsToDomainLabel = TopicBelongsToDomainLabel;

export interface LearningGoalBelongsToDomain extends BaseTopicBelongsToDomain {
  contextualKey: string;
  contextualName: string;
}
