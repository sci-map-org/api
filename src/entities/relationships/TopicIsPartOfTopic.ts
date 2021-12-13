import { SUBTOPIC_DEFAULT_INDEX_VALUE } from './TopicIsSubTopicOfTopic';

export const TopicIsPartOfTopicLabel = 'IS_PART_OF';

export const PART_OF_DEFAULT_INDEX_VALUE = SUBTOPIC_DEFAULT_INDEX_VALUE;

export interface TopicIsPartOfTopic {
  index: number;
  createdAt: number;
  createdByUserId?: string;
}
