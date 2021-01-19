import { omit } from 'lodash';
import { APIDomainAndCoveredConcepts, ResourceMediaType, ResourceType } from '../api/schema/types';
import { Resource } from '../entities/Resource';
import {
  attachLearningMaterialCoversConcepts,
  attachLearningMaterialToDomain,
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
}
interface CreateAndSaveResourceData extends CreateAndSaveResourceBaseData {
  subResourceSeries?: CreateAndSaveResourceBaseData[];
  domainsAndCoveredConcepts?: APIDomainAndCoveredConcepts[];
}

const attachDomainsAndCoveredConcepts = async (
  resourceId: string,
  domainsAndCoveredConcepts: APIDomainAndCoveredConcepts[],
  userId: string
): Promise<any> => {
  return Promise.all(
    domainsAndCoveredConcepts.map(async ({ domainId, conceptsIds }) => {
      await attachLearningMaterialToDomain(resourceId, domainId);
      conceptsIds.length &&
        (await attachLearningMaterialCoversConcepts(resourceId, conceptsIds, {
          userId,
        }));
    })
  );
};

export const createAndSaveResource = async (data: CreateAndSaveResourceData, userId: string): Promise<Resource> => {
  const createdResource = await createResource(
    { _id: userId },
    omit(data, ['tags', 'subResourceSeries', 'domainsAndCoveredConcepts'])
  );

  if (data.tags && data.tags.length) {
    const resourceTags = await Promise.all(data.tags.map(t => findOrCreateLearningMaterialTag(t)));
    await attachTagsToLearningMaterial(
      createdResource._id,
      resourceTags.map(r => r.name)
    );
  }
  if (data.domainsAndCoveredConcepts && data.domainsAndCoveredConcepts.length) {
    await attachDomainsAndCoveredConcepts(createdResource._id, data.domainsAndCoveredConcepts, userId);
  }
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
