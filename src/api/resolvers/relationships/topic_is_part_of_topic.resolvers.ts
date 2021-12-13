import {
  attachTopicIsPartOfTopic,
  detachTopicIsPartOfTopic,
  updateTopicIsPartOfTopic,
} from '../../../repositories/topics.repository';
import { initSubtopicIndexValue } from '../../../services/topics.service';
import { APIMutationResolvers } from '../../schema/types';
import { restrictAccess } from '../../util/auth';

export const attachTopicIsPartOfTopicResolver: APIMutationResolvers['attachTopicIsPartOfTopic'] = async (
  _,
  { partOfTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');

  const { partOfTopic, subTopic, relationship } = await attachTopicIsPartOfTopic(partOfTopicId, subTopicId, {
    index: payload.index || (await initSubtopicIndexValue(partOfTopicId)),
    createdByUserId: user?._id,
  });
  return { partOfTopic, subTopic, ...relationship };
};

export const updateTopicIsPartOfTopicResolver: APIMutationResolvers['updateTopicIsPartOfTopic'] = async (
  _,
  { partOfTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');

  const { partOfTopic, subTopic, relationship } = await updateTopicIsPartOfTopic(partOfTopicId, subTopicId, {
    index: payload.index || undefined,
  });
  return { partOfTopic, subTopic, ...relationship };
};

export const detachTopicIsPartOfTopicResolver: APIMutationResolvers['detachTopicIsPartOfTopic'] = async (
  _,
  { partOfTopicId, subTopicId },
  { user }
) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in');

  return await detachTopicIsPartOfTopic(partOfTopicId, subTopicId);
};
