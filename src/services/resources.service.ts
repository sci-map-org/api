import { omit } from 'lodash';
import { ResourceMediaType, ResourceType } from '../api/schema/types';
import { Resource } from '../entities/Resource';
import {
  attachLearningMaterialCoversTopics,
  attachLearningMaterialHasPrerequisiteTopic,
  showLearningMaterialInTopics,
} from '../repositories/learning_materials.repository';
import {
  attachTagsToLearningMaterial,
  findOrCreateLearningMaterialTag,
} from '../repositories/learning_material_tags.repository';
import { addSubResourceToSeries, createResource, createSubResourceSeries } from '../repositories/resources.repository';
import { sendDiscordNotification } from './discord/discord_webhooks.service';

interface CreateAndSaveResourceBaseData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
  tags?: string[];
  prerequisitesTopicsIds?: string[];
  showInTopicsIds: string[];
  coveredSubTopicsIds?: string[];
}
interface CreateAndSaveResourceData extends CreateAndSaveResourceBaseData {
  subResourceSeries?: CreateAndSaveResourceBaseData[]; // limit to one level for now
}

const attachResourceTags = async (resourceId: string, tags?: string[]): Promise<void> => {
  if (!tags || !tags.length) return;
  const resourceTags = await Promise.all(tags.map(t => findOrCreateLearningMaterialTag(t)));
  await attachTagsToLearningMaterial(
    resourceId,
    resourceTags.map(r => r.name)
  );
};

const attachPrerequisites = async (
  resourceId: string,
  userId: string,
  prerequisitesTopicsIds?: string[]
): Promise<void> => {
  if (!prerequisitesTopicsIds || !prerequisitesTopicsIds.length) return;
  await Promise.all(
    prerequisitesTopicsIds.map(async prerequisiteId =>
      attachLearningMaterialHasPrerequisiteTopic(resourceId, prerequisiteId, {
        strength: 100,
        createdByUserId: userId,
      })
    )
  );
};

// TODO: make type safe
export const createAndSaveResource = async (data: CreateAndSaveResourceData, userId: string): Promise<Resource> => {
  const createdResource = await createResource(
    { _id: userId },
    omit(data, ['tags', 'subResourceSeries', 'showInTopicsIds', 'coveredSubTopicsIds', 'prerequisitesTopicsIds'])
  );
  await Promise.all([
    attachResourceTags(createdResource._id, data.tags),
    attachPrerequisites(createdResource._id, userId, data.prerequisitesTopicsIds),
    data.showInTopicsIds.length ? showLearningMaterialInTopics(createdResource._id, data.showInTopicsIds) : undefined,
    data.coveredSubTopicsIds?.length
      ? attachLearningMaterialCoversTopics(createdResource._id, data.coveredSubTopicsIds, { userId })
      : undefined,
  ]);
  if (data.subResourceSeries && data.subResourceSeries.length) {
    const createdSubResources = await Promise.all(
      data.subResourceSeries.map(async subResourceData => createAndSaveResource(subResourceData, userId))
    );
    for (let i = 0; i < createdSubResources.length; i++) {
      const createdSubResource = createdSubResources[i];
      if (i === 0) {
        await createSubResourceSeries(createdResource._id, createdSubResource._id);
      } else {
        await addSubResourceToSeries(createdResource._id, createdSubResources[i - 1]._id, createdSubResource._id);
      }
    }
  }

  sendDiscordNotification(
    `Yay, new resource created: ${createdResource.name}, id: ${createdResource._id} (by user with id ${userId})`
  );
  return createdResource;
};
