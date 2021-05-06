import { SUBTOPIC_DEFAULT_INDEX_VALUE } from '../entities/relationships/TopicIsSubTopicOfTopic';
import { getSubTopicsMaxIndex } from '../repositories/topics.repository';

/**
 * Used so that a new subtopic is last (<=> has the highest index value) by default
 */
export const initSubtopicIndexValue = async (parentTopicId: string): Promise<number> => {
  const maxExistingIndex = await getSubTopicsMaxIndex(parentTopicId);
  return maxExistingIndex ? maxExistingIndex + 1000 : SUBTOPIC_DEFAULT_INDEX_VALUE;
};
