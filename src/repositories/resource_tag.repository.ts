import { getRelatedNodes, findOne } from './util/abstract_graph_repo';
import { ResourceLabel } from '../entities/Resource';
import { ResourceTagBelongsToResourceLabel } from '../entities/relationships/ResourceTagBelongsToResource';
import { ResourceTagLabel, ResourceTag } from '../entities/ResourceTag';

export const getResourceResourceTags = (resourceId: string) =>
  getRelatedNodes({
    originNode: {
      label: ResourceLabel,
      filter: {
        _id: resourceId,
      },
    },
    relationship: {
      label: ResourceTagBelongsToResourceLabel,
      filter: {},
    },
    destinationNode: {
      label: ResourceTagLabel,
      filter: {},
    },
  });

export const findOrCreateResourceTag = async (name: string) => {
  const existingResourceTag = await findOne<ResourceTag, { name: string }>({ label: ResourceTagLabel })({
    name: name.toLowerCase(),
  });
  if (existingResourceTag) {
    return existingResourceTag;
  }
};
