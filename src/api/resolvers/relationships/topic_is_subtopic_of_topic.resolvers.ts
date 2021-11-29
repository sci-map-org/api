import { UserInputError } from 'apollo-server-errors';
import {
  attachTopicIsSubTopicOfTopic,
  detachTopicIsSubTopicOfTopic,
  getTopicParentTopic,
  updateTopicIsSubTopicOfTopic,
} from '../../../repositories/topics.repository';
import { initSubtopicIndexValue } from '../../../services/topics.service';
import { restrictAccess } from '../../util/auth';
import { APIMutationResolvers, SubTopicRelationshipType } from '../../schema/types';

export const attachTopicIsSubTopicOfTopicResolver: APIMutationResolvers['attachTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');
  const existingParentTopic = await getTopicParentTopic(subTopicId);
  if (!!existingParentTopic) throw new UserInputError(`Topic ${subTopicId} already has a parent topic`);

  const { parentTopic, subTopic, relationship } = await attachTopicIsSubTopicOfTopic(parentTopicId, subTopicId, {
    index: payload.index || (await initSubtopicIndexValue(parentTopicId)),
    createdByUserId: user?._id,
  });
  return { parentTopic, subTopic, ...relationship, relationshipType: SubTopicRelationshipType.IS_SUBTOPIC_OF };
};

export const updateTopicIsSubTopicOfTopicResolver: APIMutationResolvers['updateTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');

  const { parentTopic, subTopic, relationship } = await updateTopicIsSubTopicOfTopic(parentTopicId, subTopicId, {
    index: payload.index || undefined,
  });
  return { parentTopic, subTopic, ...relationship, relationshipType: SubTopicRelationshipType.IS_SUBTOPIC_OF };
};

export const detachTopicIsSubTopicOfTopicResolver: APIMutationResolvers['detachTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId },
  { user }
) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in');

  return await detachTopicIsSubTopicOfTopic(parentTopicId, subTopicId);
};
