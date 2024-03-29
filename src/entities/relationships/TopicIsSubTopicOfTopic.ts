export const TopicIsSubTopicOfTopicLabel = 'IS_SUBTOPIC_OF';

export const SUBTOPIC_DEFAULT_INDEX_VALUE = 10000000;

export interface TopicIsSubTopicOfTopic {
  index: number;
  createdAt: number;
  createdByUserId?: string;
}

export enum SubTopicRelationshipType {
  IS_SUBTOPIC_OF = 'IS_SUBTOPIC_OF',
  IS_PART_OF = 'IS_PART_OF',
}
