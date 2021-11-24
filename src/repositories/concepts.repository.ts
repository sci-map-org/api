// import { map, prop } from 'ramda';
// import * as shortid from 'shortid';
// import { generateUrlKey } from '../api/util/urlKey';
// import { Concept, ConceptLabel, ConceptType } from '../entities/Concept';
// import { Domain, DomainLabel } from '../entities/Domain';
// import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
// import {
//   ConceptReferencesConcept,
//   ConceptReferencesConceptLabel,
//   STRENGTH_DEFAULT_VALUE,
// } from '../entities/relationships/ConceptReferencesConcept';
// import {
//   LearningMaterialCoversConcept,
//   LearningMaterialCoversConceptLabel,
// } from '../entities/relationships/LearningMaterialCoversConcept';
// import { UserCreatedConcept, UserCreatedConceptLabel } from '../entities/relationships/UserCreatedConcept';
// import { UserKnowsConcept, UserKnowsConceptLabel } from '../entities/relationships/UserKnowsConcept';
// import { Resource, ResourceLabel } from '../entities/Resource';
// import { TopicLabel, TopicType } from '../entities/Topic';
// import { User, UserLabel } from '../entities/User';
// import {
//   attachUniqueNodes,
//   createRelatedNode,
//   deleteOne,
//   detachUniqueNodes,
//   findOne,
//   getOptionalRelatedNode,
//   getRelatedNode,
//   getRelatedNodes,
//   updateOne,
// } from './util/abstract_graph_repo';

// interface CreateConceptData {
//   name: string;
//   types: ConceptType[];
//   key?: string;
//   description?: string;
// }

// interface UpdateConceptData {
//   key?: string;
//   name?: string;
//   types?: ConceptType[];
//   description?: string;
// }



// export const findConcept = findOne<Concept, { _id: string }>({ label: ConceptLabel });

// export const findDomainConceptByKey = (domainKey: string, conceptKey: string): Promise<Concept | null> =>
//   getOptionalRelatedNode<Domain, ConceptBelongsToDomain, Concept>({
//     originNode: {
//       label: DomainLabel,
//       filter: { key: domainKey },
//     },
//     relationship: {
//       label: ConceptBelongsToDomainLabel,
//       direction: 'IN',
//     },
//     destinationNode: {
//       label: ConceptLabel,
//       filter: { key: conceptKey },
//     },
//   }).then(result => (result ? result.destinationNode : null));

// export const updateConcept = updateOne<Concept, { _id: string }, UpdateConceptData>({ label: ConceptLabel });

// export const deleteConcept = deleteOne<Concept, { _id: string }>({ label: ConceptLabel });

// export const attachConceptToDomain = (
//   conceptId: string,
//   domainId: string,
//   { index }: { index: number }
// ): Promise<{
//   concept: Concept;
//   relationship: ConceptBelongsToDomain;
//   domain: Domain;
// }> =>
//   attachUniqueNodes<Concept, ConceptBelongsToDomain, Domain>({
//     originNode: { label: ConceptLabel, filter: { _id: conceptId } },
//     relationship: { label: ConceptBelongsToDomainLabel, onCreateProps: { index } },
//     destinationNode: { label: DomainLabel, filter: { _id: domainId } },
//   }).then(({ originNode, relationship, destinationNode }) => {
//     return {
//       concept: originNode,
//       relationship,
//       domain: destinationNode,
//     };
//   });

// export const updateConceptBelongsToDomain = (
//   conceptId: string,
//   domainId: string,
//   data: { index?: number }
// ): Promise<{
//   concept: Concept;
//   relationship: ConceptBelongsToDomain;
//   domain: Domain;
// }> =>
//   attachUniqueNodes<Concept, ConceptBelongsToDomain, Domain>({
//     originNode: { label: ConceptLabel, filter: { _id: conceptId } },
//     relationship: { label: ConceptBelongsToDomainLabel, onMergeProps: data },
//     destinationNode: { label: DomainLabel, filter: { _id: domainId } },
//   }).then(({ originNode, relationship, destinationNode }) => {
//     return {
//       concept: originNode,
//       relationship,
//       domain: destinationNode,
//     };
//   });

// export const getConceptDomain = (conceptId: string) =>
//   getRelatedNode<Domain>({
//     originNode: { label: ConceptLabel, filter: { _id: conceptId } },
//     relationship: { label: ConceptBelongsToDomainLabel, filter: {} },
//     destinationNode: { label: DomainLabel, filter: {} },
//   });

// export const getConceptCoveredByResources = (_id: string): Promise<Resource[]> =>
//   getRelatedNodes<Concept, LearningMaterialCoversConcept, Resource>({
//     originNode: {
//       label: ConceptLabel,
//       filter: { _id },
//     },
//     relationship: {
//       label: LearningMaterialCoversConceptLabel,
//     },
//     destinationNode: {
//       label: ResourceLabel,
//     },
//   }).then(map(prop('destinationNode')));

// export const getUserKnowsConcept = async (userId: string, conceptId: string): Promise<UserKnowsConcept | null> => {
//   const item = await getOptionalRelatedNode<User, UserKnowsConcept, Concept>({
//     originNode: {
//       label: UserLabel,
//       filter: { _id: userId },
//     },
//     relationship: {
//       label: UserKnowsConceptLabel,
//     },
//     destinationNode: {
//       label: ConceptLabel,
//       filter: {
//         _id: conceptId,
//       },
//     },
//   });
//   if (!item) return null;
//   return item.relationship;
// };

// export const attachConceptReferencesConcept = (
//   referencedConceptId: string,
//   referencingConceptId: string,
//   strength?: number
// ): Promise<{ referencedConcept: Concept; relationship: ConceptReferencesConcept; referencingConcept: Concept }> =>
//   attachUniqueNodes<Concept, ConceptReferencesConcept, Concept>({
//     originNode: { label: ConceptLabel, filter: { _id: referencingConceptId } },
//     relationship: {
//       label: ConceptReferencesConceptLabel,
//       onCreateProps: { strength: strength || STRENGTH_DEFAULT_VALUE },
//       onMergeProps: { strength },
//     },
//     destinationNode: { label: ConceptLabel, filter: { _id: referencedConceptId } },
//   }).then(({ originNode, relationship, destinationNode }) => {
//     return {
//       referencingConcept: originNode,
//       relationship,
//       referencedConcept: destinationNode,
//     };
//   });

// export const detachConceptReferencesConcept = (
//   referencedConceptId: string,
//   referencingConceptId: string
// ): Promise<{ referencedConcept: Concept; referencingConcept: Concept }> =>
//   detachUniqueNodes<Concept, ConceptReferencesConcept, Concept>({
//     originNode: {
//       label: ConceptLabel,
//       filter: { _id: referencingConceptId },
//     },
//     relationship: {
//       label: ConceptReferencesConceptLabel,
//       filter: {},
//     },
//     destinationNode: {
//       label: ConceptLabel,
//       filter: { _id: referencedConceptId },
//     },
//   }).then(({ originNode, destinationNode }) => {
//     return {
//       referencingConcept: originNode,
//       referencedConcept: destinationNode,
//     };
//   });

// const getConceptReferences = (filter: { _id: string } | { key: string }, direction: 'OUT' | 'IN') =>
//   getRelatedNodes<Concept, ConceptReferencesConcept, Concept>({
//     originNode: {
//       label: ConceptLabel,
//       filter,
//     },
//     relationship: {
//       label: ConceptReferencesConceptLabel,
//       direction,
//     },
//     destinationNode: {
//       label: ConceptLabel,
//     },
//   }).then(items => items.map(item => ({ concept: item.destinationNode, relationship: item.relationship })));

// export const getConceptsReferencedByConcept = (filter: { _id: string } | { key: string }) =>
//   getConceptReferences(filter, 'OUT');

// export const getConceptsReferencingConcept = (filter: { _id: string } | { key: string }) =>
//   getConceptReferences(filter, 'IN');
