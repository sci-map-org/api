import { Concept } from '../../entities/Concept';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachConceptToDomain,
  createConcept,
  deleteConcept,
  findConcept,
  getConceptDomain,
  updateConcept,
  getConceptCoveredByResources,
  getUserKnowsConcept,
} from '../../repositories/concepts.repository';
import { UnauthorizedError } from '../errors/UnauthenticatedError';
import { APIConcept, APIConceptResolvers, APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIResource } from './resources.resolvers';
import { attachUserKnowsConcepts, detachUserKnowsConcepts } from '../../repositories/users.repository';

function toAPIConcept(concept: Concept): APIConcept {
  return concept;
}

export const getConceptResolver: APIQueryResolvers['getConcept'] = async (_parent, { _id }) => {
  const concept = await findConcept({ _id });
  if (!concept) throw new NotFoundError('Concept', _id, '_id');
  return toAPIConcept(concept);
};

export const getConceptByKeyResolver: APIQueryResolvers['getConceptByKey'] = async (_parent, { key }) => {
  const concept = await findConcept({ key });
  if (!concept) throw new NotFoundError('Concept', key, 'key');
  return toAPIConcept(concept);
};

export const addConceptToDomainResolver: APIMutationResolvers['addConceptToDomain'] = async (
  _parent,
  { payload, domainId },
  ctx
) => {
  if (!ctx.user || ctx.user.role !== UserRole.ADMIN)
    throw new UnauthorizedError('Must be logged in and an admin to create a concept');
  const createdConcept = await createConcept({ _id: ctx.user._id }, nullToUndefined(payload));
  await attachConceptToDomain(createdConcept._id, domainId);
  return toAPIConcept(createdConcept);
};

export const updateConceptResolver: APIMutationResolvers['updateConcept'] = async (_parent, { _id, payload }, ctx) => {
  if (!ctx.user || ctx.user.role !== UserRole.ADMIN)
    throw new UnauthorizedError('Must be logged in and an admin to update a concept');

  const updatedConcept = await updateConcept({ _id }, nullToUndefined(payload));
  if (!updatedConcept) throw new NotFoundError('Concept', _id, 'id');
  return toAPIConcept(updatedConcept);
};

export const deleteConceptResolver: APIMutationResolvers['deleteConcept'] = async (_parent, { _id }, ctx) => {
  if (!ctx.user || ctx.user.role !== UserRole.ADMIN)
    throw new UnauthorizedError('Must be logged in and an admin to delete a concept');

  const { deletedCount } = await deleteConcept({ _id });
  if (!deletedCount) throw new NotFoundError('Concept', _id, '_id');
  return { _id, success: true };
};

export const getConceptDomainResolver: APIConceptResolvers['domain'] = async concept => {
  return await getConceptDomain(concept._id);
};

export const getConceptCoveredByResourcesResolver: APIConceptResolvers['coveredByResources'] = async (
  concept,
  { options }
) => {
  return { items: (await getConceptCoveredByResources(concept._id)).map(toAPIResource) };
};

export const getConceptKnownResolver: APIConceptResolvers['known'] = async (parentConcept, _args, { user }) => {
  if (!user) return null;

  return await getUserKnowsConcept(user._id, parentConcept._id);
};

export const setConceptsKnownResolver: APIMutationResolvers['setConceptsKnown'] = async (_p, { payload }, { user }) => {
  if (!user) throw new UnauthorizedError('Must be logged in to know a concept');
  const concepts = await Promise.all(
    payload.concepts.map(async c => {
      const foundConcept = await findConcept({ _id: c.conceptId });
      if (!foundConcept) throw new NotFoundError('Concept', c.conceptId);
      return foundConcept;
    })
  );
  await attachUserKnowsConcepts(user._id, payload.concepts);
  return concepts.map(toAPIConcept);
};

export const setConceptsUnKnownResolver: APIMutationResolvers['setConceptsUnknown'] = async (
  _p,
  { conceptIds },
  { user }
) => {
  if (!user) throw new UnauthorizedError('Must be logged in to know a concept');
  const concepts = await Promise.all(
    conceptIds.map(async conceptId => {
      const foundConcept = await findConcept({ _id: conceptId });
      if (!foundConcept) throw new NotFoundError('Concept', conceptId);
      return foundConcept;
    })
  );
  await detachUserKnowsConcepts(user._id, conceptIds);
  return concepts.map(toAPIConcept);
};
