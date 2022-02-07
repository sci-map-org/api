import { node, Query, relation } from 'cypher-query-builder';
import { omit } from 'lodash';
import * as shortid from 'shortid';
import { APITopicLearningMaterialsSortingType } from '../api/schema/types';
import { recommendationEngineConfig } from '../config';
import { LearningMaterial, LearningMaterialLabel, LearningMaterialType } from '../entities/LearningMaterial';
import { LearningMaterialTagLabel } from '../entities/LearningMaterialTag';
import { LearningPathLabel } from '../entities/LearningPath';
import {
  LearningGoalShowedInTopic,
  LearningGoalShowedInTopicLabel,
} from '../entities/relationships/LearningGoalShowedInTopic';
import { LearningMaterialCoversTopicLabel } from '../entities/relationships/LearningMaterialCoversTopic';
import { LearningMaterialShowedInTopicLabel } from '../entities/relationships/LearningMaterialShowedInTopic';
import { LearningMaterialIsTaggedLearningMaterialTagLabel } from '../entities/relationships/LearningMaterialIsTaggedLearningMaterialTag';
import { TopicHasContextTopic, TopicHasContextTopicLabel } from '../entities/relationships/TopicHasContextTopic';
import {
  TopicHasDisambiguationTopic,
  TopicHasDisambiguationTopicLabel,
} from '../entities/relationships/TopicHasDisambiguationTopic';
import {
  TopicHasPrerequisiteTopic,
  TopicHasPrerequisiteTopicLabel,
} from '../entities/relationships/TopicHasPrerequisiteTopic';
import { TopicHasTopicType, TopicHasTopicTypeLabel } from '../entities/relationships/TopicHasTopicType';
import { TopicIsPartOfTopic, TopicIsPartOfTopicLabel } from '../entities/relationships/TopicIsPartOfTopic';
import {
  SubTopicRelationshipType,
  TopicIsSubTopicOfTopic,
  TopicIsSubTopicOfTopicLabel,
} from '../entities/relationships/TopicIsSubTopicOfTopic';
import { UserCreatedTopic, UserCreatedTopicLabel } from '../entities/relationships/UserCreatedTopic';
import { UserRatedLearningMaterialLabel } from '../entities/relationships/UserRatedLearningMaterial';
import { ResourceLabel, ResourceType } from '../entities/Resource';
import { Topic, TopicLabel } from '../entities/Topic';
import { TopicType, TopicTypeLabel } from '../entities/TopicType';
import { User, UserLabel } from '../entities/User';
import { neo4jDriver, neo4jQb } from '../infra/neo4j';
import { buildFullTopicKey } from '../services/topics.service';
import {
  attachUniqueNodes,
  countRelatedNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getOptionalRelatedNode,
  getRelatedNode,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
import { PaginationOptions } from './util/pagination';
import { UserVotedLearningMaterialLabel } from '../entities/relationships/UserVotedLearningMaterial';

interface CreateTopicData {
  name: string;
  key: string;
  description?: string;
  descriptionSourceUrl?: string;
  wikipediaPageUrl?: string;
  isDisambiguation?: boolean;
  aliases?: string[];
  level?: number;
}

export const createTopic = (user: { _id: string } | { key: string }, data: CreateTopicData): Promise<Topic> =>
  createRelatedNode<User, UserCreatedTopic, Topic>({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: UserCreatedTopicLabel, props: { createdAt: Date.now() } },
    newNode: {
      labels: [TopicLabel],
      props: {
        ...omit(data, 'aliases'),
        _id: shortid.generate(),
        updatedAt: Date.now(),
        createdAt: Date.now(),
        ...(!!data.aliases?.length && {
          aliasesJson: JSON.stringify(data.aliases),
        }),
      },
    },
  });

interface UpdateTopicData {
  key?: string;
  name?: string;
  description?: string;
  descriptionSourceUrl?: string | null;
  wikipediaPageUrl?: string | null;
  context?: string | null;
  aliases?: string[] | null;
  level?: number | null;
}

type TopicFilter = { _id: string } | { key: string };

export const updateTopic = (topicFilter: TopicFilter, data: UpdateTopicData) =>
  updateOne<Topic, TopicFilter, UpdateTopicData & { updatedAt: number }>({
    label: TopicLabel,
  })(topicFilter, {
    ...omit(data, 'aliases'),
    updatedAt: Date.now(),
    ...(!!data.aliases?.length && {
      aliasesJson: JSON.stringify(data.aliases),
    }),
    ...(data.aliases === null && {
      aliasesJson: null,
    }),
  });

export const updateTopicTopicTypes = async (
  topicId: string,
  topicTypesNames: string[]
): Promise<{ topic: Topic; relationship: TopicHasTopicType; topicType: TopicType }[]> => {
  const topicTypes = topicTypesNames.map((name, index) => ({
    name,
    index,
  }));
  //   MATCH (n:Topic {key: 'functional_programming'})
  // WITH [{ name: 'concept', index: 1.0 },
  // { name: 'new', index: 2.0 },
  // { name: 'tool', index: 3.0 }] AS seeds, n
  // UNWIND seeds AS seed
  // MERGE (t:TopicType {name: seed.name})
  // MERGE (n)-[r:HAS]->(t)
  // SET r.index = seed.index
  // RETURN n,t
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `
    MATCH (n:${TopicLabel} {_id: $topicId})
    WITH $topicTypes AS topicTypes, n
    WITH topicTypes, [x IN topicTypes | x.name] as topicTypesNames, n
    OPTIONAL MATCH (n)-[r:${TopicHasTopicTypeLabel}]->(t:${TopicTypeLabel}) WHERE NOT t.name IN topicTypesNames
    DELETE r
    WITH n, topicTypes
    UNWIND topicTypes AS topicType
    MERGE (t:${TopicTypeLabel} {name: topicType.name})
    MERGE (n)-[r:${TopicHasTopicTypeLabel}]->(t)
    SET r.index = topicType.index
    RETURN properties(n) as n, properties(r) as r, properties(t) as t
    `,
    {
      topicId,
      topicTypes,
    }
  );

  if (!records.length) throw new Error('no results');
  return records.map((record) => {
    return {
      topic: record.get('n') as Topic,
      relationship: record.get('r') as TopicHasTopicType,
      topicType: record.get('t') as TopicType,
    };
  });
};

export const deleteTopic = deleteOne<Topic, { _id: string } | { key: string }>({ label: TopicLabel });

const findTopic = findOne<Topic, { _id: string } | { key: string }>({ label: TopicLabel });

export const getTopicById = (topicId: string) => findTopic({ _id: topicId });

export const getTopicByKey = (topicKey: string) => findTopic({ key: topicKey });

export const searchTopics = async (
  query: string,
  pagination: { offset?: number; limit?: number }
): Promise<Topic[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${TopicLabel}) WHERE toLower(node.name) CONTAINS toLower($query) 
    RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
    }
  );
  session.close();
  return records.map((r) => r.get('node'));
};

export const autocompleteTopicName = async (
  partialName: string,
  pagination: { offset?: number; limit?: number }
): Promise<Topic[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${TopicLabel}) WHERE toLower(node.name) CONTAINS toLower($partialName)
    WITH DISTINCT node.name as name, node
    RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      partialName,
    }
  );
  session.close();
  return records.map((r) => r.get('node'));
};

// ========= Learning materials =======
interface TopicLearningMaterialsFilter {
  resourceTypeIn?: ResourceType[];
  completedByUser?: Boolean;
  learningMaterialTypeIn?: LearningMaterialType[];
  learningMaterialTagsIn?: string[];
  durationSecondsGeq?: number;
  durationSecondsLeq?: number;
}

function initialiseQueryWithFilters(
  topicId: string,
  userId: string | undefined,
  {
    query,
    filter,
  }: {
    query?: string;
    filter: TopicLearningMaterialsFilter;
  }
): Query {
  const lmLabel =
    !!filter.learningMaterialTypeIn && filter.learningMaterialTypeIn.length === 1
      ? filter.learningMaterialTypeIn[0]
      : LearningMaterialLabel;

  const q = new Query(neo4jQb);
  if (userId) q.matchNode('u', 'User', { _id: userId });

  q.match([
    node('d', TopicLabel, { _id: topicId }),
    relation('in', '', LearningGoalShowedInTopicLabel),
    node('lm', lmLabel),
  ]);

  if (filter.learningMaterialTagsIn) {
    q.match([
      node('lm'),
      relation('out', '', LearningMaterialIsTaggedLearningMaterialTagLabel),
      node('tag', LearningMaterialTagLabel),
    ]);
  }
  q.raw(`WHERE (NOT lm:${LearningPathLabel} OR lm.public = true)`);

  if (filter.learningMaterialTagsIn) {
    q.raw(` AND tag.name IN $learningMaterialTagsIn`, { learningMaterialTagsIn: filter.learningMaterialTagsIn });
  }

  if (filter.resourceTypeIn) {
    q.raw(`AND (NOT lm:${ResourceLabel} OR any(type IN lm.types where type IN $resourceTypeIn))`, {
      resourceTypeIn: filter.resourceTypeIn,
    });
  }

  if (query) {
    q.raw(
      ` AND (toLower(lm.name) CONTAINS toLower($query) OR toLower(lm.description) CONTAINS toLower($query) OR toLower(lm.url) CONTAINS toLower($query) OR any(type in lm.types where toLower(type) CONTAINS toLower($query)))`,
      { query }
    );
  }

  if (userId) {
    if (filter.completedByUser === true) {
      q.raw(
        ` AND ((NOT lm:${ResourceLabel} OR EXISTS { (u)-[consumed_r:CONSUMED]->(lm) WHERE exists(consumed_r.consumedAt) }) 
      AND (NOT lm:${LearningPathLabel} OR EXISTS { (u)-[started_r:STARTED]->(lm) WHERE exists(started_r.completedAt) }))` // TODO add completion for lps
      );
    } else if (filter.completedByUser === false) {
      q.raw(
        ` AND (NOT lm:${ResourceLabel} OR (NOT (u)-[:CONSUMED]->(lm) OR EXISTS { (u)-[consumed_r:CONSUMED]->(lm)  where consumed_r.consumedAt IS NULL }))
      AND (NOT lm:${LearningPathLabel} OR (NOT (u)-[:STARTED]->(lm) OR EXISTS { (u)-[started_r:STARTED]->(lm)  where started_r.completedAt IS NULL }))`
      );
    }
  }
  if (filter.durationSecondsGeq) {
    q.raw(` AND lm.durationSeconds >= $durationSecondsGeq`, { durationSecondsGeq: filter.durationSecondsGeq });
  }
  if (filter.durationSecondsLeq) {
    q.raw(` AND lm.durationSeconds <= $durationSecondsLeq`, { durationSecondsLeq: filter.durationSecondsLeq });
  }

  return q;
}
export const getTopicLearningMaterials = async (
  topicId: string,
  userId: string | undefined,
  {
    query,
    filter,
    sortingType,
    pagination: paginationData,
  }: {
    query?: string;
    filter: TopicLearningMaterialsFilter;
    sortingType: APITopicLearningMaterialsSortingType;
    pagination?: PaginationOptions;
  }
): Promise<LearningMaterial[]> => {
  const pagination: PaginationOptions = {
    offset: 0,
    limit: 20,
    ...paginationData,
  };
  const q = initialiseQueryWithFilters(topicId, userId, { query, filter });
  /**
   * Personalised recommendation engine: unplugged for now, but to reuse some time later, once there's
   * proper knowledge/learning mgmt
   */
  // if (sortingType === APITopicLearningMaterialsSortingType.Recommended) {
  //   q.optionalMatch([node('lm'), relation('out', '', LearningMaterialCoversTopicLabel), node('cc', TopicLabel)]);
  //   q.optionalMatch([
  //     node('cc'),
  //     relation('out', 'dpc', TopicHasPrerequisiteTopicLabel, [0, 5]),
  //     node('mpc', TopicLabel),
  //   ]);
  //   q.raw(`WHERE NOT (lm)-[:${LearningMaterialCoversTopicLabel}]->(mpc)`);
  //   if (userId) q.raw('AND NOT (u)-[:KNOWS]->(mpc)');
  //   if (userId) q.optionalMatch([node('cc'), relation('in', 'rkc', 'KNOWS'), node('u')]);
  //   if (userId)
  //     q.with([
  //       'DISTINCT lm',
  //       'CASE WHEN lm:LearningPath THEN 1 ELSE 0 END as isLearningPath',
  //       'u',
  //       'count(cc) as ccc',
  //       'count(distinct mpc) as cmpc',
  //       '1 - toFloat(count(rkc)+0.0001)/(count(cc)+0.0001) as usefulness',
  //     ]);
  //   else
  //     q.with([
  //       'DISTINCT lm',
  //       'CASE WHEN lm:LearningPath THEN 1 ELSE 0 END as isLearningPath',
  //       'count(cc) as ccc',
  //       'count(distinct mpc) as cmpc',
  //     ]);

  //   if (userId && filter.completedByUser === false) {
  //     // can avoid doing that for lps
  //     // undefined case: cprnc = 0 and npr =0
  //     q.raw(`CALL {
  //       WITH lm,u
  //         MATCH (nextToConsume:${lmLabel})-[rel:HAS_NEXT|STARTS_WITH*0..100]->(lm)
  //         WHERE (NOT (u)-[:CONSUMED]->(nextToConsume) OR EXISTS { (u)-[consumed_r:CONSUMED]->(nextToConsume)  where consumed_r.consumedAt IS NULL })
  //         AND ((NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)) OR EXISTS { (u)-[consumed_r:CONSUMED]->(previous:Resource)-[:HAS_NEXT|:STARTS_WITH]->(nextToConsume)  where consumed_r.consumedAt IS NOT NULL })
  //         WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel, (1-sign(size((lm)<-[:HAS_NEXT]-(:Resource)))) as npr ORDER BY countRel DESC LIMIT 1
  //         return nextToConsume[0] as nextToConsumeInSeries, npr,  size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
  //     }`);
  //     q.return([
  //       'lm',
  //       'isLearningPath',
  //       'cmpc',
  //       ' usefulness',
  //       `sign(ccc)*usefulness/(0.1+cmpc)  + (-1*cprnc) + (1 -sign(cprnc))*((1-npr)*0.5) + isLearningPath*${recommendationEngineConfig.learningMaterials.learningPathBonus} as score`,
  //     ]);
  //   } else {
  //     // when not logged in, find the first one of series, return cprnc for each of them in order to order them
  //     q.raw(`CALL {
  //       WITH lm
  //         MATCH (nextToConsume:${lmLabel})-[rel:HAS_NEXT|STARTS_WITH*0..100]->(lm)
  //         WHERE NOT (nextToConsume)<-[:HAS_NEXT|:STARTS_WITH]-(:Resource)
  //         WITH collect(nextToConsume) as nextToConsume, rel, count(rel) as countRel ORDER BY countRel DESC LIMIT 1
  //         return nextToConsume[0] as nextToConsumeInSeries, size([x in rel where type(x) = 'HAS_NEXT']) as cprnc
  //     }`);
  //     q.return([
  //       'lm',
  //       'cmpc',
  //       `sign(ccc)/(0.1+cmpc) -1*cprnc + isLearningPath*${recommendationEngineConfig.learningMaterials.learningPathBonus} as score`,
  //     ]);
  //   }
  //   q.orderBy('score', 'DESC');
  // } else

  if (sortingType === APITopicLearningMaterialsSortingType.MostRecommended) {
    q.optionalMatch([
      node('lm'),
      relation('in', 'votedLearningMaterial', UserVotedLearningMaterialLabel, { value: 1 }),
      node('', 'User'),
    ]);
    q.with(['DISTINCT lm', 'sum(votedLearningMaterial.value) AS recommendationsCount']);
    q.return(['lm', 'recommendationsCount']);

    q.raw(' ORDER BY recommendationsCount IS NOT NULL DESC, recommendationsCount DESC');
  } else {
    q.match([node('lm'), relation('in', 'createdLearningMaterial', 'CREATED'), node('', 'User')]);
    q.with(['DISTINCT lm', 'createdLearningMaterial']);
    q.return(['lm']);

    q.orderBy('createdLearningMaterial.createdAt', 'DESC');
  }
  if (pagination) {
    if (pagination.offset) {
      q.raw(` SKIP ${pagination.offset} `);
    }
    if (pagination.limit) {
      q.raw(` LIMIT ${pagination.limit} `);
    }
  }

  const r = await q.run();
  const learningMaterials = r.map((i) => i.lm.properties);
  return learningMaterials;
};

export const countLearningMaterialsShowedInTopic = async (
  topicId: string,
  userId: string | undefined,
  {
    query,
    filter,
  }: {
    query?: string;
    filter: TopicLearningMaterialsFilter;
  }
): Promise<number> => {
  if (!query && !Object.keys(filter)) {
    return countRelatedNodes<Topic, LearningGoalShowedInTopic, LearningMaterial>({
      originNode: {
        label: TopicLabel,
        filter: { _id: topicId },
      },
      relationship: {
        label: LearningMaterialShowedInTopicLabel,
        filter: {},
      },
      destinationNode: {
        label: LearningMaterialLabel,
      },
    });
  }
  const q = initialiseQueryWithFilters(topicId, userId, { query, filter });
  q.return(['count(lm) as count']);

  const r = await q.run();
  const counts = r.map((i) => i.count);
  if (!counts || counts.length > 1) throw new Error('Failed counting learning materials');
  return Number(counts[0].toString());
};

export const getTopicLearningMaterialsTagsFilters = async (
  topicId: string,
  filters: TopicLearningMaterialsFilter
): Promise<{ name: string; count: number }[]> => {
  const q = initialiseQueryWithFilters(topicId, undefined, { filter: omit(filters, 'learningMaterialTagsIn') });

  q.with('lm');
  q.optionalMatch([
    node('lm'),
    relation('out', 'r', LearningMaterialIsTaggedLearningMaterialTagLabel),
    node('tag', LearningMaterialTagLabel),
  ]);
  q.with(['distinct tag', 'count(r) as count where tag is not null']);
  q.return(['tag', 'count']);
  q.orderBy('count', 'DESC');

  const results = await q.run();
  return results.map((record) => ({ name: record.tag.properties.name, count: Number(record.count.toString()) }));
};

export const getTopicLearningMaterialsTypesFilters = async (
  topicId: string
): Promise<{
  types: ResourceType[];
  learningPathsCount: number;
  leq30minCount: number;
  geq30minCount: number;
}> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `match (n:Topic {_id: $topicId})-[:SHOWED_IN]-(lm:LearningMaterial) 
    WITH apoc.coll.toSet(apoc.coll.flatten(collect(lm.types))) as types,
    size([x in collect(lm) where x:LearningPath and x.public = true]) as learningPathsCount, 
    size([x in collect(lm) where x.durationSeconds <= 30*60]) as leq30minCount, 
    size([x in collect(lm) where x.durationSeconds >= 30*60]) as geq30minCount 
    return types, learningPathsCount, leq30minCount, geq30minCount`,
    {
      topicId,
    }
  );
  session.close();
  if (!records.length) throw new Error('getTopicLearningMaterialsTypesFilters: neo4j query failed, no results');

  return {
    types: records[0].get('types') as ResourceType[],
    learningPathsCount: Number(records[0].get('learningPathsCount').toString()),
    leq30minCount: Number(records[0].get('leq30minCount').toString()),
    geq30minCount: Number(records[0].get('geq30minCount').toString()),
  };
};

// TODO
// export const getLearningGoalsShowedInTopic = (
//   domainId: string
// ): Promise<{ learningGoal: LearningGoal; relationship: LearningGoalBelongsToDomain; domain: Domain }[]> =>
//   getRelatedNodes<Domain, LearningGoalBelongsToDomain, LearningGoal>({
//     originNode: {
//       label: DomainLabel,
//       filter: { _id: domainId },
//     },
//     relationship: {
//       label: LearningGoalBelongsToDomainLabel,
//       direction: 'IN',
//     },
//     destinationNode: {
//       label: LearningGoalLabel,
//       filter: { hidden: false },
//     },
//   }).then(items =>
//     items.map(({ destinationNode, relationship, originNode }) => ({
//       learningGoal: destinationNode,
//       relationship,
//       domain: originNode,
//     }))
//   );
// ======== SUBTOPICS =========

// TODO include "part_of" topics
// TODO check if duplicates in results
export const searchSubTopics = async (
  rootTopicId: string,
  query: string,
  pagination: { offset?: number; limit?: number }
): Promise<Topic[]> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (rootTopic:${TopicLabel}) WHERE rootTopic._id = $rootTopicId
    MATCH (rootTopic)<-[:${TopicIsSubTopicOfTopicLabel}*1..20]-(node:${TopicLabel})
    AND (toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query)) 
     RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
      rootTopicId,
    }
  );
  session.close();

  return records.map((r) => r.get('node'));
};

export const getTopicSubTopicsTotalCount = async (_id: string): Promise<number> => {
  const q = new Query(neo4jQb);
  q.raw(
    `match (n:${TopicLabel} {_id: $topicId})<-[:${TopicIsSubTopicOfTopicLabel}*1..20]-(c:${TopicLabel})  return count(DISTINCT c) as size`,
    {
      topicId: _id,
    }
  );
  const r = await q.run();
  const [size] = r.map((i) => i.size);
  return size;
};

export const getTopicSubTopics = async (
  topicId: string
): Promise<
  {
    parentTopic: Topic;
    relationship: TopicIsSubTopicOfTopic | TopicIsPartOfTopic;
    subTopic: Topic;
    relationshipType: SubTopicRelationshipType;
  }[]
> =>
  getRelatedNodes<Topic, TopicIsSubTopicOfTopic | TopicIsPartOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: `${TopicIsSubTopicOfTopicLabel}|${TopicIsPartOfTopicLabel}`,
      direction: 'IN',
    },
    destinationNode: {
      label: TopicLabel,
    },
    sorting: {
      entity: 'relationship',
      field: 'index',
      direction: 'ASC',
    },
  }).then((items) =>
    items.map(({ relationship, destinationNode, originNode, originalRelationship }) => ({
      parentTopic: originNode,
      relationship,
      subTopic: destinationNode,
      relationshipType: originalRelationship.type,
    }))
  );

export const getTopicParentTopic = (
  topicId: string
): Promise<{ parentTopic: Topic; relationship: TopicIsSubTopicOfTopic; subTopic: Topic } | null> =>
  getOptionalRelatedNode<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((item) =>
    item
      ? {
          parentTopic: item.destinationNode,
          relationship: item.relationship,
          subTopic: item.originNode,
        }
      : null
  );

export const attachTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string,
  { index, createdByUserId }: { index: number; createdByUserId?: string }
): Promise<{
  parentTopic: Topic;
  relationship: TopicIsSubTopicOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      onCreateProps: { index, createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: parentTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      parentTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const updateTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string,
  { index }: { index?: number }
): Promise<{
  parentTopic: Topic;
  relationship: TopicIsSubTopicOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: { label: TopicIsSubTopicOfTopicLabel, onMergeProps: { ...(!!index && { index }) } },
    destinationNode: { label: TopicLabel, filter: { _id: parentTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      parentTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const detachTopicIsSubTopicOfTopic = (
  parentTopicId: string,
  subTopicId: string
): Promise<{ subTopic: Topic; parentTopic: Topic }> =>
  detachUniqueNodes<Topic, TopicIsSubTopicOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: subTopicId },
    },
    relationship: {
      label: TopicIsSubTopicOfTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: parentTopicId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subTopic: originNode,
      parentTopic: destinationNode,
    };
  });

// ====== Prerequisites ======
export const attachTopicHasPrerequisiteTopic = (
  topicId: string,
  prerequisiteTopicId: string,
  data: Omit<TopicHasPrerequisiteTopic, 'createdAt'>
): Promise<{ prerequisiteTopic: Topic; relationship: TopicHasPrerequisiteTopic; topic: Topic }> =>
  attachUniqueNodes<Topic, TopicHasPrerequisiteTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: topicId } },
    relationship: {
      label: TopicHasPrerequisiteTopicLabel,
      onCreateProps: { ...data, createdAt: Date.now() },
    },
    destinationNode: { label: TopicLabel, filter: { _id: prerequisiteTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      topic: originNode,
      relationship,
      prerequisiteTopic: destinationNode,
    };
  });

export const detachTopicHasPrerequisiteTopic = (
  topicId: string,
  prerequisiteTopicId: string
): Promise<{ prerequisiteTopic: Topic; topic: Topic }> =>
  detachUniqueNodes<Topic, TopicHasPrerequisiteTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicHasPrerequisiteTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: prerequisiteTopicId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      topic: originNode,
      prerequisiteTopic: destinationNode,
    };
  });

const getTopicPrerequisiteRelations = (
  filter: { _id: string } | { key: string },
  direction: 'OUT' | 'IN'
): Promise<{ originTopic: Topic; destinationTopic: Topic; relationship: TopicHasPrerequisiteTopic }[]> =>
  getRelatedNodes<Topic, TopicHasPrerequisiteTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter,
    },
    relationship: {
      label: TopicHasPrerequisiteTopicLabel,
      direction,
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((items) =>
    items.map((item) => ({
      originTopic: item.originNode,
      destinationTopic: item.destinationNode,
      relationship: item.relationship,
    }))
  );

export const getTopicPrerequisites = (
  filter: { _id: string } | { key: string }
): Promise<{ prerequisiteTopic: Topic; relationship: TopicHasPrerequisiteTopic; followUpTopic: Topic }[]> =>
  getTopicPrerequisiteRelations(filter, 'OUT').then((items) =>
    items.map(({ originTopic, relationship, destinationTopic }) => ({
      prerequisiteTopic: destinationTopic,
      relationship,
      followUpTopic: originTopic,
    }))
  );

export const getTopicFollowUps = (
  filter: { _id: string } | { key: string }
): Promise<{ prerequisiteTopic: Topic; relationship: TopicHasPrerequisiteTopic; followUpTopic: Topic }[]> =>
  getTopicPrerequisiteRelations(filter, 'IN').then((items) =>
    items.map(({ originTopic, relationship, destinationTopic }) => ({
      prerequisiteTopic: originTopic,
      relationship,
      followUpTopic: destinationTopic,
    }))
  );

export const getSubTopicsMaxIndex = async (topicId: string): Promise<number | null> => {
  const q = new Query(neo4jQb);

  q.match([
    node('n', TopicLabel, { _id: topicId }),
    relation('in', 'r', [TopicIsSubTopicOfTopicLabel, TopicIsPartOfTopicLabel]),
    node('s', TopicLabel),
  ]);

  q.return({ 'r.index': 'maxIndex' });
  q.orderBy({ 'r.index': 'DESC' });
  q.limit(1);

  const r = await q.run();
  if (!r.length) return null;
  const [maxIndex] = r.map((i) => i.maxIndex);

  return maxIndex;
};

export const getTopicCreator = (topicFilter: { _id: string }) =>
  getRelatedNode<User>({
    originNode: {
      label: TopicLabel,
      filter: topicFilter,
    },
    relationship: {
      label: UserCreatedTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: UserLabel,
      filter: {},
    },
  });

export const attachTopicIsPartOfTopic = (
  partOfTopicId: string,
  subTopicId: string,
  { index, createdByUserId }: { index: number; createdByUserId?: string }
): Promise<{
  partOfTopic: Topic;
  relationship: TopicIsPartOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsPartOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: {
      label: TopicIsPartOfTopicLabel,
      onCreateProps: { index, createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: partOfTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      partOfTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const updateTopicIsPartOfTopic = (
  partOfTopicId: string,
  subTopicId: string,
  { index }: { index?: number }
): Promise<{
  partOfTopic: Topic;
  relationship: TopicIsPartOfTopic;
  subTopic: Topic;
}> =>
  attachUniqueNodes<Topic, TopicIsPartOfTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: subTopicId } },
    relationship: { label: TopicIsPartOfTopicLabel, onMergeProps: { ...(!!index && { index }) } },
    destinationNode: { label: TopicLabel, filter: { _id: partOfTopicId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      partOfTopic: destinationNode,
      relationship,
      subTopic: originNode,
    };
  });

export const detachTopicIsPartOfTopic = (
  partOfTopicId: string,
  subTopicId: string
): Promise<{ subTopic: Topic; partOfTopic: Topic }> =>
  detachUniqueNodes<Topic, TopicIsPartOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: subTopicId },
    },
    relationship: {
      label: TopicIsPartOfTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: partOfTopicId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subTopic: originNode,
      partOfTopic: destinationNode,
    };
  });

export const getTopicPartOfTopics = (
  topicFilter: { _id: string } | { key: string }
): Promise<{ subTopic: Topic; partOfTopic: Topic; relationship: TopicIsPartOfTopic }[]> =>
  getRelatedNodes<Topic, TopicIsPartOfTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: topicFilter,
    },
    relationship: {
      label: TopicIsPartOfTopicLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((items) =>
    items.map((item) => ({
      subTopic: item.originNode,
      partOfTopic: item.destinationNode,
      relationship: item.relationship,
    }))
  );

export const getTopicDisambiguationTopic = (
  topicId: string
): Promise<{
  contextualisedTopic: Topic;
  relationship: TopicHasDisambiguationTopic;
  disambiguationTopic: Topic;
} | null> =>
  getOptionalRelatedNode<Topic, TopicHasDisambiguationTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicHasDisambiguationTopicLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((item) =>
    item
      ? {
          disambiguationTopic: item.destinationNode,
          relationship: item.relationship,
          contextualisedTopic: item.originNode,
        }
      : null
  );

export const getTopicContextualisedTopics = (
  topicFilter: { _id: string } | { key: string }
): Promise<{ disambiguationTopic: Topic; contextualisedTopic: Topic; relationship: TopicHasDisambiguationTopic }[]> =>
  getRelatedNodes<Topic, TopicHasDisambiguationTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { ...topicFilter, isDisambiguation: true },
    },
    relationship: {
      label: TopicHasDisambiguationTopicLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((items) =>
    items.map((item) => ({
      disambiguationTopic: item.originNode,
      contextualisedTopic: item.destinationNode,
      relationship: item.relationship,
    }))
  );

export const getTopicContextTopic = (
  topicId: string
): Promise<{
  contextualisedTopic: Topic;
  relationship: TopicHasContextTopic;
  contextTopic: Topic;
} | null> =>
  getOptionalRelatedNode<Topic, TopicHasContextTopic, Topic>({
    originNode: {
      label: TopicLabel,
      filter: { _id: topicId },
    },
    relationship: {
      label: TopicHasContextTopicLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then((item) =>
    item
      ? {
          contextualisedTopic: item.originNode,
          contextTopic: item.destinationNode,
          relationship: item.relationship,
        }
      : null
  );

export const getTopicsValidContexts = async (
  parentTopicId: string,
  topicId: string
): Promise<{
  validContexts: Topic[];
}> => {
  const session = neo4jDriver.session();

  // match  (d:Topic {_id: '1r3rf5', isDisambiguation: true})<-[:HAS_DISAMBIGUATION]-(ct:Topic)-[:HAS_CONTEXT]->(c:Topic)
  // match p = (ct)-[:IS_SUBTOPIC_OF*0..5]->(p2:Topic)-[:IS_SUBTOPIC_OF]->(c)
  // with nodes(p) as n
  // with  apoc.coll.flatten(collect(n)) as flat
  // match path = (n:Topic {_id: 'AvgsEAdEM'})-[:IS_SUBTOPIC_OF*0..5]->(p:Topic)
  // where p IN flat or (NOT (p)-[:IS_SUBTOPIC_OF]->(:Topic)) return [i in nodes(path) where NOT i in flat] as validContexts, n

  const { records } = await session.run(
    `
      match (t:${TopicLabel} {_id: $topicId})-[:${TopicHasDisambiguationTopicLabel}]->(d:${TopicLabel} {isDisambiguation: true}) 
    match  (d)<-[:${TopicHasDisambiguationTopicLabel}]-(ct:${TopicLabel})-[:${TopicHasContextTopicLabel}]->(c:${TopicLabel})
    where ct._id <> $topicId
    match p = (ct)-[:${TopicIsSubTopicOfTopicLabel}*0..8]->(p2:${TopicLabel})-[:${TopicIsSubTopicOfTopicLabel}]->(c)
  with nodes(p) as n
  with  apoc.coll.flatten(collect(n)) as flat
  match path = (n:${TopicLabel} {_id: $parentTopicId})-[:${TopicIsSubTopicOfTopicLabel}*0..8]->(p:${TopicLabel})
  where p IN flat or (NOT (p)-[:${TopicIsSubTopicOfTopicLabel}]->(:${TopicLabel})) return [i in nodes(path) where NOT i in flat] as validContexts, n
    `,
    {
      topicId,
      parentTopicId,
    }
  );

  if (!records.length) throw new Error('no results');

  return {
    validContexts: records[0].get('validContexts').map((t) => t.properties),
  };
};

export const getTopicValidContextsFromSameName = async (
  parentTopicId: string,
  existingSameNameTopicId: string
): Promise<{
  // commonParent?: Topic;
  validContexts: Topic[];
  validSameNameTopicContexts: Topic[];
}> => {
  const session = neo4jDriver.session();

  // match path1 = (n:Topic {_id: 'GR8NWFGOZ'})-[r1:IS_SUBTOPIC_OF*0..5]->(p1:Topic)  match path2 = (n2:Topic {_id: 'HFx--g2LV'})-[r2:IS_SUBTOPIC_OF*0..5]->(p2:Topic)   where p1._id = p2._id or (NOT ((p1)-[:IS_SUBTOPIC_OF]->(:Topic)) and not ((p2)-[:IS_SUBTOPIC_OF]->(:Topic))) return nodes(path1) as validContexts, nodes(path2) as validSameNameTopicContexts
  // pretty fragile query, as in the case where the topics have a common parent they will return 2 results:
  // the paths up to the common parent and the full paths until there's no parent
  // Therefore, the order of the results matters (we want the first condition first)
  const { records } = await session.run(
    `match path1 = (n:${TopicLabel} {_id: $parentTopicId})-[r1:${TopicIsSubTopicOfTopicLabel}*0..5]->(p1:Topic)  
    match path2 = (n2:${TopicLabel} {_id: $existingSameNameTopicId})-[r2:${TopicIsSubTopicOfTopicLabel}*0..5]->(p2:Topic)  
     where p1._id = p2._id 
     or (NOT ((p1)-[:${TopicIsSubTopicOfTopicLabel}]->(:${TopicLabel})) 
     and not ((p2)-[:${TopicIsSubTopicOfTopicLabel}]->(:${TopicLabel})))
     return nodes(path1) as validContexts, nodes(path2)[1..(size(nodes(path2))+1)] as validSameNameTopicContexts
  `,
    { parentTopicId, existingSameNameTopicId } //TODO: kick first path2 node
  );
  if (!records.length) throw new Error('no results');

  return {
    validContexts: records[0].get('validContexts').map((t) => t.properties),
    validSameNameTopicContexts: records[0].get('validSameNameTopicContexts').map((t) => t.properties),
  };
};

export const getTopicsValidContextsFromDisambiguation = async (
  parentTopicId: string,
  disambiguationTopicId: string
): Promise<{
  validContexts: Topic[];
}> => {
  const session = neo4jDriver.session();

  // match  (d:Topic {_id: '1r3rf5', isDisambiguation: true})<-[:HAS_DISAMBIGUATION]-(ct:Topic)-[:HAS_CONTEXT]->(c:Topic)
  // match p = (ct)-[:IS_SUBTOPIC_OF*0..5]->(p2:Topic)-[:IS_SUBTOPIC_OF]->(c)
  // with nodes(p) as n
  // with  apoc.coll.flatten(collect(n)) as flat
  // match path = (n:Topic {_id: 'AvgsEAdEM'})-[:IS_SUBTOPIC_OF*0..5]->(p:Topic)
  // where p IN flat or (NOT (p)-[:IS_SUBTOPIC_OF]->(:Topic)) return [i in nodes(path) where NOT i in flat] as validContexts, n

  const { records } = await session.run(
    `
  match  (d:${TopicLabel} {_id: $disambiguationTopicId, isDisambiguation: true})<-[:${TopicHasDisambiguationTopicLabel}]-(ct:${TopicLabel})-[:${TopicHasContextTopicLabel}]->(c:${TopicLabel})
  match p = (ct)-[:${TopicIsSubTopicOfTopicLabel}*0..8]->(p2:${TopicLabel})-[:${TopicIsSubTopicOfTopicLabel}]->(c)
with nodes(p) as n
with  apoc.coll.flatten(collect(n)) as flat
match path = (n:${TopicLabel} {_id: $parentTopicId})-[:${TopicIsSubTopicOfTopicLabel}*0..5]->(p:${TopicLabel})
where p IN flat or (NOT (p)-[:${TopicIsSubTopicOfTopicLabel}]->(:${TopicLabel})) return [i in nodes(path) where NOT i in flat] as validContexts, n
  `,
    {
      disambiguationTopicId,
      parentTopicId,
    }
  );

  if (!records.length) throw new Error('no results');

  return {
    validContexts: records[0].get('validContexts').map((t) => t.properties),
  };
};

export const attachTopicHasDisambiguationTopic = async (
  topicId: string,
  disambiguationTopic: string,
  { createdByUserId }: { createdByUserId: string }
): Promise<{
  topic: Topic;
  relationship: TopicHasDisambiguationTopic;
  disambiguationTopic: Topic;
}> => {
  const existingDisambiguationTopic = await getTopicDisambiguationTopic(topicId);
  if (!!existingDisambiguationTopic) throw new Error(`Topic ${topicId} already has a disambiguation topic`);

  const { destinationNode, relationship, originNode } = await attachUniqueNodes<
    Topic,
    TopicHasDisambiguationTopic,
    Topic
  >({
    originNode: { label: TopicLabel, filter: { _id: topicId } },
    relationship: {
      label: TopicHasDisambiguationTopicLabel,
      onCreateProps: { createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: disambiguationTopic, isDisambiguation: true } },
  });
  return {
    topic: originNode,
    relationship,
    disambiguationTopic: destinationNode,
  };
};

export const attachTopicHasContextTopic = async (
  topicId: string,
  contextTopicId: string,
  { createdByUserId }: { createdByUserId: string }
): Promise<{
  topic: Topic;
  relationship: TopicHasContextTopic;
  contextTopic: Topic;
}> => {
  const existingContextTopic = await getTopicContextTopic(topicId);
  if (!!existingContextTopic) throw new Error(`Topic ${topicId} already has a context`);

  const {
    destinationNode: contextTopic,
    relationship,
    originNode: topic,
  } = await attachUniqueNodes<Topic, TopicHasContextTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: topicId } },
    relationship: {
      label: TopicHasContextTopicLabel,
      onCreateProps: { createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: contextTopicId } },
  });

  // when creating a contextualised topic, we directly set the key with the context in it at creation. In
  // that case,  we need to check that we don't add it twice

  const updatedTopic = await updateTopic(
    { _id: topicId },
    {
      context: contextTopic.name,
      ...(!topic.key.includes(`(${contextTopic.key})`) && { key: buildFullTopicKey(topic.key, contextTopic.key) }),
    }
  );
  if (!updatedTopic) throw new Error('Should never happen');

  return {
    topic: updatedTopic,
    relationship,
    contextTopic,
  };
};

export const updateTopicHasContextTopic = async (
  topicId: string,
  newContextTopicId: string,
  { createdByUserId }: { createdByUserId: string }
): Promise<{
  topic: Topic;
  relationship: TopicHasContextTopic;
  contextTopic: Topic;
}> => {
  const existingContextResult = await getTopicContextTopic(topicId);
  if (!existingContextResult) throw new Error(`Topic ${topicId} has no existing context`);

  await detachUniqueNodes<Topic, TopicHasContextTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: topicId } },
    relationship: {
      label: TopicHasContextTopicLabel,
      filter: {},
    },
    destinationNode: { label: TopicLabel, filter: { _id: existingContextResult.contextTopic._id } },
  });

  const {
    destinationNode: newContextTopic,
    relationship,
    originNode: topic,
  } = await attachUniqueNodes<Topic, TopicHasContextTopic, Topic>({
    originNode: { label: TopicLabel, filter: { _id: topicId } },
    relationship: {
      label: TopicHasContextTopicLabel,
      onCreateProps: { createdAt: Date.now(), createdByUserId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: newContextTopicId } },
  });

  const updatedTopic = await updateTopic(
    { _id: topicId },
    {
      context: newContextTopic.name,
      key: topic.key.replace(`_(${existingContextResult.contextTopic.key})`, `_(${newContextTopic.key})`),
    }
  );
  if (!updatedTopic) throw new Error('Topic not found - unreachable code reached');
  return {
    topic: updatedTopic,
    relationship,
    contextTopic: newContextTopic,
  };
};

// known

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
