import { APICreateTopicContextOptions, APICreateTopicPayload } from '../api/schema/types';
import { TOPIC_HAS_PREREQUISITE_TOPIC_STRENGTH_DEFAULT_VALUE } from '../entities/relationships/TopicHasPrerequisiteTopic';
import { SUBTOPIC_DEFAULT_INDEX_VALUE } from '../entities/relationships/TopicIsSubTopicOfTopic';
import { Topic } from '../entities/Topic';
import { env } from '../env';
import {
  attachTopicHasContextTopic,
  attachTopicHasDisambiguationTopic,
  attachTopicHasPrerequisiteTopic,
  attachTopicIsSubTopicOfTopic,
  createTopic,
  getSubTopicsMaxIndex,
} from '../repositories/topics.repository';
import { attachTopicTypeToTopic, findOrCreateTopicType } from '../repositories/topic_types.repository';
import { JWTPayload } from './auth/jwt';
import { sendDiscordNotification } from './discord/discord_webhooks.service';

/**
 * Used so that a new subtopic is last (<=> has the highest index value) by default
 */
export const initSubtopicIndexValue = async (parentTopicId: string): Promise<number> => {
  const maxExistingIndex = await getSubTopicsMaxIndex(parentTopicId);
  return maxExistingIndex ? maxExistingIndex + 1000 : SUBTOPIC_DEFAULT_INDEX_VALUE;
};

const attachTopicTypes = async (topicId: string, topicTypes: string[]): Promise<void> => {
  await Promise.all(
    topicTypes.map(async (type) => {
      await findOrCreateTopicType(type);
      await attachTopicTypeToTopic(topicId, type);
    })
  );
};

const attachTopicPrerequisites = async (
  topicId: string,
  userId: string,
  prerequisitesTopicsIds: string[]
): Promise<void> => {
  await Promise.all(
    prerequisitesTopicsIds.map(async (prerequisiteId) =>
      attachTopicHasPrerequisiteTopic(topicId, prerequisiteId, {
        strength: TOPIC_HAS_PREREQUISITE_TOPIC_STRENGTH_DEFAULT_VALUE,
        createdByUserId: userId,
      })
    )
  );
};

export const createFullTopic = async (
  creationData: APICreateTopicPayload,
  user: JWTPayload,
  addSubTopicOptions?: {
    parentTopicId: string;
    contextOptions?: APICreateTopicContextOptions;
  }
): Promise<Topic> => {
  const createdTopic = await createTopic(
    { _id: user._id },
    {
      name: creationData.name,
      key: creationData.key,
      description: creationData.description || undefined,
      descriptionSourceUrl: creationData.descriptionSourceUrl || undefined,
      wikipediaPageUrl: creationData.wikipediaPageUrl || undefined,
      isDisambiguation: false,
      aliases: creationData.aliases || undefined,
      level: creationData.level || undefined,
    }
  );
  await Promise.all([
    attachTopicTypes(createdTopic._id, creationData.topicTypes),
    attachTopicPrerequisites(createdTopic._id, user._id, creationData.prerequisitesTopicsIds),
  ]);
  let parentTopicName: string | undefined = undefined;
  if (addSubTopicOptions) {
    const { parentTopic } = await attachTopicIsSubTopicOfTopic(addSubTopicOptions.parentTopicId, createdTopic._id, {
      index: await initSubtopicIndexValue(addSubTopicOptions.parentTopicId),
      createdByUserId: user._id,
    });
    parentTopicName = parentTopic.name;
    if (addSubTopicOptions.contextOptions) {
      await attachTopicHasDisambiguationTopic(
        createdTopic._id,
        addSubTopicOptions.contextOptions.disambiguationTopicId,
        {
          createdByUserId: user._id,
        }
      );
      await attachTopicHasContextTopic(createdTopic._id, addSubTopicOptions.contextOptions.contextTopicId, {
        createdByUserId: user._id,
      });
    }
  }
  sendDiscordNotification(
    `New Topic created by @${user.key}: ${createdTopic.name} (_id: ${createdTopic._id}), ${
      env.OTHER.FRONTEND_BASE_URL
    }/topics/${createdTopic.key} ${parentTopicName ? 'as subtopic of ' + parentTopicName : ''}. 
     - description: ${createdTopic.description} (sourceUrl: ${createdTopic.descriptionSourceUrl})
     - level: ${createdTopic.level ? createdTopic.level + '/100' : 'not applicable'}
     - topic types: ${creationData.topicTypes.join(', ')}
     - ${creationData.prerequisitesTopicsIds.length} prerequisites`
  );
  return createdTopic;
};

export const buildFullTopicKey = (topicKey: string, contextKey: string) => `${topicKey}_(${contextKey})}`;
