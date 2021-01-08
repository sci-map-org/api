import { ConceptBelongsToDomain } from './ConceptBelongsToDomain';
import { DomainBelongsToDomain } from './DomainBelongsToDomain';
import { LearningGoalBelongsToDomain } from './LearningGoalBelongsToDomain';

export const TopicBelongsToDomainLabel = 'BELONGS_TO';

export const DEFAULT_INDEX_VALUE = 10000000;

export interface BaseTopicBelongsToDomain {
  index: number;
}

export type TopicBelongsToDomain = DomainBelongsToDomain | ConceptBelongsToDomain | LearningGoalBelongsToDomain;
