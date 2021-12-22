import { TOPIC_HAS_PREREQUISITE_TOPIC_STRENGTH_DEFAULT_VALUE } from '../../../entities/relationships/TopicHasPrerequisiteTopic';
import {
  attachTopicHasPrerequisiteTopic,
  detachTopicHasPrerequisiteTopic,
} from '../../../repositories/topics.repository';
import { APIMutationResolvers } from '../../schema/types';
import { restrictAccess } from '../../util/auth';

export const addTopicHasPrerequisiteTopicResolver: APIMutationResolvers['addTopicHasPrerequisiteTopic'] = async (
  _,
  { topicId, prerequisiteTopicId, strength },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify topic prerequisites'
  );
  const { topic, prerequisiteTopic, relationship } = await attachTopicHasPrerequisiteTopic(
    topicId,
    prerequisiteTopicId,
    { strength: strength || TOPIC_HAS_PREREQUISITE_TOPIC_STRENGTH_DEFAULT_VALUE, createdByUserId: user!._id }
  );
  return { topic, prerequisiteTopic, strength: relationship.strength };
};

export const removeTopicHasPrerequisiteTopicResolver: APIMutationResolvers['removeTopicHasPrerequisiteTopic'] = async (
  _,
  { topicId, prerequisiteTopicId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify topic prerequisites'
  );
  const { topic, prerequisiteTopic } = await detachTopicHasPrerequisiteTopic(topicId, prerequisiteTopicId);
  return { topic, prerequisiteTopic };
};
