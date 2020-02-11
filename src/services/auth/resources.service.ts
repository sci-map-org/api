import { ResourceType, ResourceMediaType } from '../../api/schema/types';
import { createResource } from '../../repositories/resources.repository';
import { Resource } from '../../entities/Resource';
import { omit } from 'lodash';
import { attachResourceTagsToResource, findOrCreateResourceTag } from '../../repositories/resource_tags.repository';

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
    const resourceTags = await Promise.all(tags.map(t => findOrCreateResourceTag(t)));
    await attachResourceTagsToResource(
      createdResource._id,
      resourceTags.map(r => r.name)
    );
  }
  return createdResource;
};
