import { omit } from 'lodash';
import { ResourceMediaType, ResourceType } from '../api/schema/types';
import { Resource } from '../entities/Resource';
import { createResource } from '../repositories/resources.repository';
import { attachTagsToLearningMaterial, findOrCreateLearningMaterialTag } from '../repositories/learning_material_tags.repository';
import { sendDiscordNotification } from './discord/discord_webhooks.service';

interface CreateAndSaveResourceData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
  tags?: string[];
}

export const createAndSaveResource = async (data: CreateAndSaveResourceData, userId: string): Promise<Resource> => {
  const tags = data.tags;
  const createdResource = await createResource({ _id: userId }, omit(data, 'tags'));
  if (tags && tags.length) {
    const resourceTags = await Promise.all(tags.map(t => findOrCreateLearningMaterialTag(t)));
    await attachTagsToLearningMaterial(
      createdResource._id,
      resourceTags.map(r => r.name)
    );
  }
  sendDiscordNotification(
    `Yay, new resource created: ${createdResource.name}, id: ${createdResource._id} (by user with id ${userId})`
  );
  return createdResource;
};
