import { hasLabel, inArray, node, not, Query, relation } from 'cypher-query-builder';
import { map } from 'ramda';
import * as shortid from 'shortid';
import { APIDomainLearningMaterialsSortingType, APIDomainResourcesSortingType } from '../api/schema/types';
import { recommendationEngineConfig } from '../config';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import { LearningMaterialLabel, LearningMaterialType } from '../entities/LearningMaterial';
import { LearningPath, LearningPathLabel } from '../entities/LearningPath';
import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import { DomainBelongsToDomain, DomainBelongsToDomainLabel } from '../entities/relationships/DomainBelongsToDomain';
import {
  LearningGoalBelongsToDomain,
  LearningGoalBelongsToDomainLabel,
} from '../entities/relationships/LearningGoalBelongsToDomain';
import {
  LearningMaterialBelongsToDomain,
  LearningMaterialBelongsToDomainLabel,
} from '../entities/relationships/LearningMaterialBelongsToDomain';
import {
  DEFAULT_INDEX_VALUE,
  TopicBelongsToDomain,
  TopicBelongsToDomainLabel,
} from '../entities/relationships/TopicBelongsToDomain';
import { UserCreatedDomain, UserCreatedDomainLabel } from '../entities/relationships/UserCreatedDomain';
import { Resource, ResourceLabel, ResourceType } from '../entities/Resource';
import { Topic, TopicLabel } from '../entities/Topic';
import { User, UserLabel } from '../entities/User';
import { neo4jDriver, neo4jQb } from '../infra/neo4j';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
import { SortingDirection } from './util/sorting';

interface CreateDomainData {
  key: string;
  name: string;
  description?: string;
}

interface UpdateDomainData {
  key?: string;
  name?: string;
  description?: string;
}

export const createDomain = (user: { _id: string } | { key: string }, data: CreateDomainData): Promise<Domain> =>
  createRelatedNode<User, UserCreatedDomain, Domain>({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: UserCreatedDomainLabel, props: { createdAt: Date.now() } },
    newNode: { labels: [DomainLabel], props: { ...data, _id: shortid.generate() } },
  });

export const searchDomains = async (
  { query }: { query?: string },
  pagination: { offset?: number; limit?: number }
): Promise<Domain[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${DomainLabel}) ${
      query ? 'WHERE toLower(node.name) CONTAINS toLower($query) ' : ''
    }RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => r.get('node'));
};

export const findDomain = findOne<Domain, { key: string } | { _id: string }>({ label: DomainLabel });

export const updateDomain = updateOne<Domain, { _id: string } | { key: string }, UpdateDomainData>({
  label: DomainLabel,
});

export const deleteDomain = deleteOne<Domain, { _id: string } | { key: string }>({ label: DomainLabel });

export const getDomainConcepts = (
  domainFilter: { key: string } | { _id: string },
  sorting?: { direction: SortingDirection; entity: 'relationship' | 'concept'; field: 'index' | '_id' }
): Promise<{ concept: Concept; relationship: ConceptBelongsToDomain }[]> =>
  getRelatedNodes<Domain, ConceptBelongsToDomain, Concept>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: ConceptBelongsToDomainLabel,
    },
    destinationNode: {
      label: ConceptLabel,
    },
    ...(sorting && {
      sorting: {
        entity: sorting.entity === 'concept' ? 'destinationNode' : sorting.entity,
        direction: sorting.direction,
        field: sorting.field,
      },
    }),
  }).then(
    map(item => ({
      relationship: item.relationship,
      concept: item.destinationNode,
    }))
  );

export const getDomainPublicLearningPaths = (
  domainFilter: { key: string } | { _id: string },
  sorting?: { direction: SortingDirection; field: 'createdAt' }
): Promise<LearningPath[]> =>
  getRelatedNodes<Domain, LearningMaterialBelongsToDomain, LearningPath>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: LearningMaterialBelongsToDomainLabel,
    },
    destinationNode: {
      label: LearningPathLabel,
      filter: { public: true },
    },
    ...(sorting && {
      sorting: {
        entity: 'destinationNode',
        direction: sorting.direction,
        field: sorting.field,
      },
    }),
  }).then(map(item => item.destinationNode));
interface DomainResourcesFilter {
  resourceTypeIn?: ResourceType[];
  consumedByUser: Boolean;
}

export const getDomainResources = async (
  domainId: string,
  userId: string | undefined,
  {
    query,
    filter,
    sortingType,
  }: { query?: string; filter: DomainResourcesFilter; sortingType: APIDomainResourcesSortingType }
): Promise<Resource[]> => {
  const q = new Query(neo4jQb);
  if (userId) q.matchNode('u', 'User', { _id: userId });

  q.match([node('d', 'Domain', { _id: domainId }), relation('in', '', 'BELONGS_TO'), node('r', 'Resource')]);

  let whereClauseStarted = false;
  if (!!filter.resourceTypeIn) {
    q.where({
      r: {
        ...(!!filter?.resourceTypeIn && { type: inArray(filter.resourceTypeIn) }),
      },
    });
    whereClauseStarted = true;
  }

  if (query) {
    q.raw(
      `${
        whereClauseStarted ? ' AND ' : 'WHERE '
      } (toLower(r.name) CONTAINS toLower($query) OR toLower(r.description) CONTAINS toLower($query) OR toLower(r.url) CONTAINS toLower($query) OR toLower(r.type) CONTAINS toLower($query))`,
      { query }
    );
    whereClauseStarted = true;
  }

  if (userId) {
    if (filter.consumedByUser === true) {
      q.raw(
        `${
          whereClauseStarted ? ' AND ' : 'WHERE '
        } EXISTS { (u)-[consumed_r:CONSUMED]->(r) WHERE exists(consumed_r.consumedAt) }`
      );
    } else {
      q.raw(
        `${
          whereClauseStarted ? ' AND ' : 'WHERE '
        } (NOT (u)-[:CONSUMED]->(r) OR EXISTS { (u)-[consumed_r:CONSUMED]->(r)  where consumed_r.consumedAt IS NULL })`
      );
    }
  }

  if (sortingType === APIDomainResourcesSortingType.Recommended) {
    q.optionalMatch([node('r'), relation('out', '', 'COVERS'), node('cc', 'Concept')]);
    q.optionalMatch([node('cc'), relation('out', 'dpc', 'REFERENCES', [0, 5]), node('mpc', 'Concept')]);
    q.raw('WHERE NOT (r)-[:COVERS]->(mpc)');
    if (userId) q.raw('AND NOT (u)-[:KNOWS]->(mpc)');
    if (userId) q.optionalMatch([node('cc'), relation('in', 'rkc', 'KNOWS'), node('u')]);
    if (userId)
      q.with([
        'DISTINCT r',
        'u',
        'count(cc) as ccc',
        'count(distinct mpc) as cmpc',
        '1 - toFloat(count(rkc)+0.0001)/(count(cc)+0.0001) as usefulness',
      ]);
    else q.with(['DISTINCT r', 'count(cc) as ccc', 'count(distinct mpc) as cmpc']);

    if (userId && filter.consumedByUser === false) {
      q.raw(`CALL {
        WITH r,u
          MATCH (nextToConsume:Resource)-[rel:HAS_NEXT|STARTS_WITH*0..100]->(r)
          WHERE (NOT (u)-[:CONSUMED]->(nextToConsume) OR EXISTS { (u)-[consumed_r:CONSUMED]->(nextToConsume)  where consumed_r.consumedAt IS NULL })
          AND ((NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)) OR EXISTS { (u)-[consumed_r:CONSUMED]->(previous:Resource)-[:HAS_NEXT|:STARTS_WITH]->(nextToConsume)  where consumed_r.consumedAt IS NOT NULL })
          WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel, (1-sign(size((r)<-[:HAS_NEXT]-(:Resource)))) as npr ORDER BY countRel DESC LIMIT 1
          return nextToConsume[0] as nextToConsumeInSeries, npr,  size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
      }`);
      q.return([
        'r',
        'properties(r) as resource',
        'cmpc',
        ' usefulness',
        'sign(ccc)*usefulness/(0.1+cmpc) + (-1*cprnc) + (1 -sign(cprnc))*((1-npr)*0.5) as score',
      ]);
    } else {
      q.raw(`CALL {
        WITH r
          MATCH (nextToConsume:Resource)-[rel:HAS_NEXT|STARTS_WITH*0..100]->(r)
          WHERE NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)
          WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel ORDER BY countRel DESC LIMIT 1
          return nextToConsume[0] as nextToConsumeInSeries, size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
      }`);
      q.return(['r', 'cmpc', 'sign(ccc)/(0.1+cmpc) -1*cprnc as score']);
    }
    q.orderBy('score', 'DESC');
  } else {
    q.match([node('r'), relation('in', 'createdResource', 'CREATED'), node('', 'User')]);
    q.return(['r']);
    q.orderBy('createdResource.createdAt', 'DESC');
  }

  const r = await q.run();
  const resources = r.map(i => i.r.properties);
  return resources;
};

interface DomainLearningMaterialsFilter {
  resourceTypeIn?: ResourceType[];
  completedByUser: Boolean;
  learningMaterialTypeIn?: LearningMaterialType[];
}

export const getDomainLearningMaterials = async (
  domainId: string,
  userId: string | undefined,
  {
    query,
    filter,
    sortingType,
  }: { query?: string; filter: DomainLearningMaterialsFilter; sortingType: APIDomainLearningMaterialsSortingType }
): Promise<Resource[]> => {
  const lmLabel =
    !!filter.learningMaterialTypeIn && filter.learningMaterialTypeIn.length === 1
      ? filter.learningMaterialTypeIn[0]
      : LearningMaterialLabel;

  const q = new Query(neo4jQb);
  if (userId) q.matchNode('u', 'User', { _id: userId });

  q.match([node('d', 'Domain', { _id: domainId }), relation('in', '', 'BELONGS_TO'), node('lm', lmLabel)]);

  q.raw(`WHERE (NOT lm:${LearningPathLabel} OR lm.public = true)`);

  if (filter.resourceTypeIn) {
    q.raw(`AND (NOT lm:${ResourceLabel} OR lm.type IN $resourceTypeIn)`, {
      resourceTypeIn: filter.resourceTypeIn,
    });
  }

  if (query) {
    q.raw(
      ` AND (toLower(lm.name) CONTAINS toLower($query) OR toLower(lm.description) CONTAINS toLower($query) OR toLower(lm.url) CONTAINS toLower($query) OR toLower(lm.type) CONTAINS toLower($query))`,
      { query }
    );
  }

  if (userId) {
    if (filter.completedByUser) {
      q.raw(
        ` AND ((NOT lm:${ResourceLabel} OR EXISTS { (u)-[consumed_r:CONSUMED]->(lm) WHERE exists(consumed_r.consumedAt) }) 
        AND (NOT lm:${LearningPathLabel} OR EXISTS { (u)-[started_r:STARTED]->(lm) WHERE exists(started_r.completedAt) }))` // TODO add completion for lps
      );
    } else {
      q.raw(
        ` AND (NOT lm:${ResourceLabel} OR (NOT (u)-[:CONSUMED]->(lm) OR EXISTS { (u)-[consumed_r:CONSUMED]->(lm)  where consumed_r.consumedAt IS NULL }))
        AND (NOT lm:${LearningPathLabel} OR (NOT (u)-[:STARTED]->(lm) OR EXISTS { (u)-[started_r:STARTED]->(lm)  where started_r.completedAt IS NULL }))`
      );
    }
  }

  if (sortingType === APIDomainLearningMaterialsSortingType.Recommended) {
    q.optionalMatch([node('lm'), relation('out', '', 'COVERS'), node('cc', 'Concept')]);
    q.optionalMatch([node('cc'), relation('out', 'dpc', 'REFERENCES', [0, 5]), node('mpc', 'Concept')]);
    q.raw('WHERE NOT (lm)-[:COVERS]->(mpc)');
    if (userId) q.raw('AND NOT (u)-[:KNOWS]->(mpc)');
    if (userId) q.optionalMatch([node('cc'), relation('in', 'rkc', 'KNOWS'), node('u')]);
    if (userId)
      q.with([
        'DISTINCT lm',
        'CASE WHEN lm:LearningPath THEN 1 ELSE 0 END as isLearningPath',
        'u',
        'count(cc) as ccc',
        'count(distinct mpc) as cmpc',
        '1 - toFloat(count(rkc)+0.0001)/(count(cc)+0.0001) as usefulness',
      ]);
    else
      q.with([
        'DISTINCT lm',
        'CASE WHEN lm:LearningPath THEN 1 ELSE 0 END as isLearningPath',
        'count(cc) as ccc',
        'count(distinct mpc) as cmpc',
      ]);

    if (userId && filter.completedByUser === false) {
      // can avoid doing that for lps
      // undefined case: cprnc = 0 and npr =0
      q.raw(`CALL {
        WITH lm,u
          MATCH (nextToConsume:${lmLabel})-[rel:HAS_NEXT|STARTS_WITH*0..100]->(lm)
          WHERE (NOT (u)-[:CONSUMED]->(nextToConsume) OR EXISTS { (u)-[consumed_r:CONSUMED]->(nextToConsume)  where consumed_r.consumedAt IS NULL })
          AND ((NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)) OR EXISTS { (u)-[consumed_r:CONSUMED]->(previous:Resource)-[:HAS_NEXT|:STARTS_WITH]->(nextToConsume)  where consumed_r.consumedAt IS NOT NULL })
          WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel, (1-sign(size((lm)<-[:HAS_NEXT]-(:Resource)))) as npr ORDER BY countRel DESC LIMIT 1
          return nextToConsume[0] as nextToConsumeInSeries, npr,  size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
      }`);
      q.return([
        'lm',
        'isLearningPath',
        'cmpc',
        ' usefulness',
        `sign(ccc)*usefulness/(0.1+cmpc)  + (-1*cprnc) + (1 -sign(cprnc))*((1-npr)*0.5) + isLearningPath*${recommendationEngineConfig.learningMaterials.learningPathBonus} as score`,
      ]);
    } else {
      // when not logged in, find the first one of series, return cprnc for each of them in order to order them
      q.raw(`CALL {
        WITH lm
          MATCH (nextToConsume:${lmLabel})-[rel:HAS_NEXT|STARTS_WITH*0..100]->(lm)
          WHERE NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)
          WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel ORDER BY countRel DESC LIMIT 1
          return nextToConsume[0] as nextToConsumeInSeries, size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
      }`);
      q.return([
        'lm',
        'cmpc',
        `sign(ccc)/(0.1+cmpc) -1*cprnc + isLearningPath*${recommendationEngineConfig.learningMaterials.learningPathBonus} as score`,
      ]);
    }
    q.orderBy('score', 'DESC');
  } else {
    q.match([node('lm'), relation('in', 'createdLearningMaterial', 'CREATED'), node('', 'User')]);
    q.return(['lm']);
    q.orderBy('createdLearningMaterial.createdAt', 'DESC');
  }

  const r = await q.run();
  // console.log(r.map(i => ({ name: i.lm.properties.name, score: i.score, isLearningPath: i.isLearningPath })));
  const learningMaterials = r.map(i => i.lm.properties);
  return learningMaterials;
};

export const attachDomainBelongsToDomain = (
  parentDomainId: string,
  subDomainId: string,
  index?: number
): Promise<{ subDomain: Domain; relationship: DomainBelongsToDomain; parentDomain: Domain }> =>
  attachUniqueNodes<Concept, DomainBelongsToDomain, Domain>({
    originNode: { label: DomainLabel, filter: { _id: subDomainId } },
    relationship: {
      label: DomainBelongsToDomainLabel,
      onCreateProps: { index: index || DEFAULT_INDEX_VALUE },
      onMergeProps: { index },
    },
    destinationNode: { label: DomainLabel, filter: { _id: parentDomainId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      subDomain: originNode,
      relationship,
      parentDomain: destinationNode,
    };
  });

export const detachDomainBelongsToDomain = (
  parentDomainId: string,
  subDomainId: string
): Promise<{ subDomain: Domain; parentDomain: Domain }> =>
  detachUniqueNodes<Domain, DomainBelongsToDomain, Domain>({
    originNode: {
      label: DomainLabel,
      filter: { _id: subDomainId },
    },
    relationship: {
      label: DomainBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: DomainLabel,
      filter: { _id: parentDomainId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subDomain: originNode,
      parentDomain: destinationNode,
    };
  });

const getDomainBelongsToDomains = (filter: { _id: string } | { key: string }, direction: 'IN' | 'OUT') =>
  getRelatedNodes<Domain, DomainBelongsToDomain, Domain>({
    originNode: {
      label: DomainLabel,
      filter,
    },
    relationship: {
      label: DomainBelongsToDomainLabel,
      direction,
    },
    destinationNode: {
      label: DomainLabel,
    },
  }).then(items => items.map(item => ({ domain: item.destinationNode, relationship: item.relationship })));

export const getDomainSubDomains = (filter: { _id: string } | { key: string }) =>
  getDomainBelongsToDomains(filter, 'IN');

export const getDomainParentDomains = (filter: { _id: string } | { key: string }) =>
  getDomainBelongsToDomains(filter, 'OUT');

export const getDomainLearningGoals = (
  domainId: string
): Promise<{ learningGoal: LearningGoal; relationship: LearningGoalBelongsToDomain; domain: Domain }[]> =>
  getRelatedNodes<Domain, LearningGoalBelongsToDomain, LearningGoal>({
    originNode: {
      label: DomainLabel,
      filter: { _id: domainId },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: LearningGoalLabel,
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningGoal: destinationNode,
      relationship,
      domain: originNode,
    }))
  );

// export const getDomainSubTopics = (
//   domainId: string
// ): Promise<{ domain: Domain; subTopics: { relationship: TopicBelongsToDomain; topic: Topic }[] } | null> =>
//   getRelatedNodes<Domain, TopicBelongsToDomain, Topic>({
//     originNode: {
//       label: DomainLabel,
//       filter: { _id: domainId },
//     },
//     relationship: {
//       label: TopicBelongsToDomainLabel,
//       direction: 'IN',
//     },
//     destinationNode: {
//       label: TopicLabel,
//     },
//   }).then(items => {
//     if (items.length) {
//       return {
//         domain: items[0].originNode,
//         subTopics: items.map(({ relationship, destinationNode }) => ({ relationship, topic: destinationNode })),
//       };
//     }
//     return null;
//   });
