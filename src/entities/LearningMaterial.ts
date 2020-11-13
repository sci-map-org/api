import { LearningPath } from "./LearningPath"
import { Resource } from "./Resource"

export const LearningMaterialLabel = 'LearningMaterial'

export interface BaseLearningMaterial {
    _id: string
    createdAt: number
}

export type LearningMaterial = Resource | LearningPath 