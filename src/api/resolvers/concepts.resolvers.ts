import { omit } from 'lodash';
import { Concept } from '../../entities/Concept';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachConceptBelongsToConcept,
  attachConceptReferencesConcept,
  attachConceptToDomain,
  createConcept,
  deleteConcept,
  detachConceptBelongsToConcept,
  detachConceptReferencesConcept,
  findConcept,
  findDomainConceptByKey,
  getConceptCoveredByResources,
  getConceptDomain,
  getConceptParentConcepts,
  getConceptsReferencedByConcept,
  getConceptsReferencingConcept,
  getConceptSubConcepts,
  getUserKnowsConcept,
  updateConcept,
  updateConceptBelongsToDomain,
} from '../../repositories/concepts.repository';
import { attachUserKnowsConcepts, detachUserKnowsConcepts } from '../../repositories/users.repository';
import { APIConcept, APIConceptResolvers, APIMutationResolvers, APIQueryResolvers } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIResource } from './resources.resolvers';

function toAPIConcept(concept: Concept): APIConcept {
  return concept;
}

export const getConceptResolver: APIQueryResolvers['getConcept'] = async (_parent, { _id }) => {
  const concept = await findConcept({ _id });
  if (!concept) throw new NotFoundError('Concept', _id, '_id');
  return toAPIConcept(concept);
};

export const getDomainConceptByKeyResolver: APIQueryResolvers['getDomainConceptByKey'] = async (
  _parent,
  { conceptKey, domainKey }
) => {
  const concept = await findDomainConceptByKey(domainKey, conceptKey);
  if (!concept) throw new NotFoundError('Concept', conceptKey, 'key');
  return toAPIConcept(concept);
};

export const addConceptToDomainResolver: APIMutationResolvers['addConceptToDomain'] = async (
  _parent,
  { payload, domainId },
  ctx
) => {
  restrictAccess('contributorOrAdmin', ctx.user, 'Must be logged in and a contributor or an admin to create a concept');
  const index = payload.index || 10000000;
  const createdConcept = await createConcept({ _id: ctx.user!._id }, nullToUndefined(omit(payload, 'index')));
  await attachConceptToDomain(createdConcept._id, domainId, { index });
  return toAPIConcept(createdConcept);
};

export const updateConceptResolver: APIMutationResolvers['updateConcept'] = async (_parent, { _id, payload }, ctx) => {
  restrictAccess('contributorOrAdmin', ctx.user, 'Must be logged in and a contributor or an admin to update a concept');

  const updatedConcept = await updateConcept({ _id }, nullToUndefined(payload));
  if (!updatedConcept) throw new NotFoundError('Concept', _id, 'id');
  return toAPIConcept(updatedConcept);
};

export const deleteConceptResolver: APIMutationResolvers['deleteConcept'] = async (_parent, { _id }, ctx) => {
  restrictAccess('contributorOrAdmin', ctx.user, 'Must be logged in and a contributor or an admin to update a concept');

  const { deletedCount } = await deleteConcept({ _id });
  if (!deletedCount) throw new NotFoundError('Concept', _id, '_id');
  return { _id, success: true };
};

export const getConceptDomainResolver: APIConceptResolvers['domain'] = async concept => {
  return await getConceptDomain(concept._id);
};

export const getConceptCoveredByResourcesResolver: APIConceptResolvers['coveredByResources'] = async concept => {
  return { items: (await getConceptCoveredByResources(concept._id)).map(toAPIResource) };
};

export const getConceptKnownResolver: APIConceptResolvers['known'] = async (parentConcept, _args, { user }) => {
  if (!user) return null;
  return await getUserKnowsConcept(user._id, parentConcept._id);
};

export const setConceptsKnownResolver: APIMutationResolvers['setConceptsKnown'] = async (_p, { payload }, { user }) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to know a concept');
  const concepts = await Promise.all(
    payload.concepts.map(async c => {
      const foundConcept = await findConcept({ _id: c.conceptId });
      if (!foundConcept) throw new NotFoundError('Concept', c.conceptId);
      return foundConcept;
    })
  );
  await attachUserKnowsConcepts(user!._id, payload.concepts);
  return concepts.map(toAPIConcept);
};

export const setConceptsUnKnownResolver: APIMutationResolvers['setConceptsUnknown'] = async (
  _p,
  { conceptIds },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to unknow a concept');
  const concepts = await Promise.all(
    conceptIds.map(async conceptId => {
      const foundConcept = await findConcept({ _id: conceptId });
      if (!foundConcept) throw new NotFoundError('Concept', conceptId);
      return foundConcept;
    })
  );
  await detachUserKnowsConcepts(user!._id, conceptIds);
  return concepts.map(toAPIConcept);
};

export const updateConceptBelongsToDomainResolver: APIMutationResolvers['updateConceptBelongsToDomain'] = async (
  _parent,
  { conceptId, domainId, payload },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify domain <- concept relationship'
  );

  const { relationship } = await updateConceptBelongsToDomain(conceptId, domainId, nullToUndefined(payload));
  return relationship;
};

export const addConceptReferencesConceptResolver: APIMutationResolvers['addConceptReferencesConcept'] = async (
  _parent,
  { conceptId, referencedConceptId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify concept references relationships'
  );
  const { referencingConcept } = await attachConceptReferencesConcept(referencedConceptId, conceptId);
  return referencingConcept;
};

export const removeConceptReferencesConceptResolver: APIMutationResolvers['removeConceptReferencesConcept'] = async (
  _parent,
  { conceptId, referencedConceptId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify concept references relationships'
  );
  const { referencingConcept } = await detachConceptReferencesConcept(referencedConceptId, conceptId);
  return referencingConcept;
};

// ok naming is weird I know, cause we change the subject
export const getConceptReferencingConceptsResolver: APIConceptResolvers['referencingConcepts'] = async concept => {
  return getConceptsReferencedByConcept({ _id: concept._id });
};

export const getConceptReferencedByConceptsResolver: APIConceptResolvers['referencedByConcepts'] = async concept => {
  return getConceptsReferencingConcept({ _id: concept._id });
};

export const addConceptBelongsToConceptResolver: APIMutationResolvers['addConceptBelongsToConcept'] = async (
  _p,
  { parentConceptId, subConceptId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify concept grouping relationships'
  );

  const { parentConcept } = await attachConceptBelongsToConcept(parentConceptId, subConceptId);
  return parentConcept;
};
export const removeConceptBelongsToConceptResolver: APIMutationResolvers['removeConceptBelongsToConcept'] = async (
  _p,
  { parentConceptId, subConceptId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify concept grouping relationships'
  );
  const { parentConcept } = await detachConceptBelongsToConcept(parentConceptId, subConceptId);
  return parentConcept;
};

export const getConceptSubConceptsResolver: APIConceptResolvers['subConcepts'] = async concept => {
  return getConceptSubConcepts({ _id: concept._id });
};
export const getConceptParentConceptsResolver: APIConceptResolvers['parentConcepts'] = async concept => {
  return getConceptParentConcepts({ _id: concept._id });
};
