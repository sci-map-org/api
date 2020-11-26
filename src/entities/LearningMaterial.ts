import { LearningPath, LearningPathLabel } from './LearningPath';
import { Resource, ResourceLabel } from './Resource';

export const LearningMaterialLabel = 'LearningMaterial';

export interface BaseLearningMaterial {
  _id: string;
  createdAt: number;
}

export type LearningMaterial = Resource | LearningPath;

export type LearningMaterialType = typeof ResourceLabel | typeof LearningPathLabel;
