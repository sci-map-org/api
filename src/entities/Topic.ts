// import { Concept } from './Concept';
// import { Domain } from './Domain';
// import { LearningGoal } from './LearningGoal';

export const TopicLabel = 'Topic';

export interface Topic {
  _id: string;
  name: string;
  key: string;
  description?: string;
  // topicType: TopicType;
}

// interface BaseTopic extends TopicInterface {

// }

// export type Topic = BaseTopic | LearningGoal;

// export interface Topic extends TopicInterface {
  
// }

// export enum TopicType {
//   Topic = 'Topic',
//   // Concept = 'Concept',
//   LearningGoal = 'LearningGoal',
// }
