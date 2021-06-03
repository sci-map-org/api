import { isNull, node, not, Query, relation } from 'cypher-query-builder';
import { omit } from 'lodash';
import * as shortid from 'shortid';
import { generateUrlKey } from '../api/util/urlKey';
import { ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { LearningGoal, LearningGoalLabel, LearningGoalType } from '../entities/LearningGoal';
import { LearningMaterial, LearningMaterialLabel } from '../entities/LearningMaterial';
import {
  LearningGoalBelongsToDomain,
  LearningGoalBelongsToDomainLabel,
} from '../entities/relationships/LearningGoalBelongsToDomain';
import {
  LearningGoalDependsOnLearningGoalInLearningGoal,
  LearningGoalDependsOnLearningGoalInLearningGoalLabel,
} from '../entities/relationships/LearningGoalDependsOnLearningGoalInLearningGoal';
import {
  LearningGoalRequiresSubGoal,
  LearningGoalRequiresSubGoalLabel,
} from '../entities/relationships/LearningGoalRequiresSubGoal';
import { LearningMaterialCoversConceptLabel } from '../entities/relationships/LearningMaterialCoversConcept';
import {
  LearningMaterialLeadsToLearningGoal,
  LearningMaterialLeadsToLearningGoalLabel,
} from '../entities/relationships/LearningMaterialLeadsToLearningGoal';
import { DEFAULT_INDEX_VALUE } from '../entities/relationships/TopicBelongsToDomain';
import {
  UserCreatedLearningGoal,
  UserCreatedLearningGoalLabel,
} from '../entities/relationships/UserCreatedLearningGoal';
import { UserCreatedLearningMaterialLabel } from '../entities/relationships/UserCreatedLearningMaterial';
import { UserKnowsConceptLabel } from '../entities/relationships/UserKnowsConcept';
import { UserRatedLearningGoal, UserRatedLearningGoalLabel } from '../entities/relationships/UserRatedLearningGoal';
import { UserRatedLearningMaterialLabel } from '../entities/relationships/UserRatedLearningMaterial';
import {
  UserStartedLearningGoal,
  UserStartedLearningGoalLabel,
} from '../entities/relationships/UserStartedLearningGoal';
import { SubGoal } from '../entities/SubGoal';
import { TopicLabel, TopicType } from '../entities/Topic';
import { User, UserLabel } from '../entities/User';
import { neo4jDriver, neo4jQb } from '../infra/neo4j';
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
import { generateGetRatingMethod, generateRateEntityMethod } from './util/rating';

interface CreateLearningGoalData {
  name: string;
  type: LearningGoalType;
  key?: string;
  description?: string;
  publishedAt?: number;
  hidden: boolean;
}

export const createLearningGoal = (
  userFilter: { _id: string } | { key: string },
  data: CreateLearningGoalData
): Promise<LearningGoal> =>
  createRelatedNode<User, UserCreatedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: userFilter },
    relationship: { label: UserCreatedLearningGoalLabel, props: { createdAt: Date.now() } },
    newNode: {
      labels: [LearningGoalLabel, TopicLabel],
      props: {
        ...data,
        _id: shortid.generate(),
        key: data.key ? generateUrlKey(data.key) : generateLearningGoalKey(data.name),
        topicType: TopicType.LearningGoal,
      },
    },
  });

interface UpdateLearningGoalPayload {
  name?: string;
  key?: string;
  type?: LearningGoalType;
  description?: string | null;
  public?: boolean;
  hidden?: boolean;
}

interface UpdateLearningGoalData {
  name?: string;
  key?: string;
  type?: LearningGoalType;
  description?: string | null;
  publishedAt?: number;
  hidden?: boolean;
}

export const updateLearningGoal = (filter: { _id: string } | { key: string }, data: UpdateLearningGoalPayload) =>
  updateOne<LearningGoal, { _id: string } | { key: string }, UpdateLearningGoalData>({
    label: LearningGoalLabel,
  })(filter, { ...omit(data, 'public'), publishedAt: data.public ? Date.now() : undefined });

export const findLearningGoal = findOne<LearningGoal, { key: string } | { _id: string }>({ label: LearningGoalLabel });

export const searchLearningGoals = async (
  { query }: { query?: string },
  pagination: { offset?: number; limit?: number }
): Promise<LearningGoal[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${LearningGoalLabel}) WHERE node.hidden = false ${
      query
        ? ' AND (toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query))'
        : ''
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
export const findLearningGoalCreatedBy = (
  userId: string,
  learningGoalFilter: { _id: string } | { key: string }
): Promise<LearningGoal | null> =>
  getOptionalRelatedNode<User, UserCreatedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserCreatedLearningGoalLabel, direction: 'OUT' },
    destinationNode: { label: LearningGoalLabel, filter: learningGoalFilter },
  }).then(result => (result ? result.destinationNode : null));

export const deleteLearningGoal = deleteOne<LearningGoal, { _id: string } | { key: string }>({
  label: LearningGoalLabel,
});

export const attachLearningGoalToDomain = (
  learningGoalId: string,
  domainId: string,
  { index }: { index?: number }
): Promise<{ domain: Domain; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      onCreateProps: { index: index || DEFAULT_INDEX_VALUE },
      onMergeProps: { index },
    },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, domain: destinationNode }));

export const detachLearningGoalFromDomain = (
  learningGoalId: string,
  domainId: string
): Promise<{ domain: Domain; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: { label: LearningGoalBelongsToDomainLabel, filter: {} },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, domain: destinationNode }));

export const getLearningGoalDomain = (
  learningGoalId: string
): Promise<{ domain: Domain; relationship: LearningGoalBelongsToDomain; learningGoal: LearningGoal } | null> =>
  getOptionalRelatedNode<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: {
      label: LearningGoalLabel,
      filter: {
        _id: learningGoalId,
      },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: DomainLabel,
      filter: {},
    },
  }).then(data =>
    data ? { domain: data.destinationNode, relationship: data.relationship, learningGoal: data.originNode } : null
  );

export const findDomainLearningGoalByKey = (
  domainKey: string,
  learningGoalkey: string
): Promise<{ learningGoal: LearningGoal; domain: Domain } | null> =>
  getOptionalRelatedNode<Domain, LearningGoalBelongsToDomain, LearningGoal>({
    originNode: {
      label: DomainLabel,
      filter: { key: domainKey },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { key: learningGoalkey },
    },
  }).then(result => (result ? { learningGoal: result.destinationNode, domain: result.originNode } : null));

function generateLearningGoalKey(name: string) {
  return shortid.generate() + '_' + generateUrlKey(name);
}

export const attachLearningGoalRequiresSubGoal = async (
  learningGoalId: string,
  subGoalId: string,
  { strength }: { strength?: number }
): Promise<{ subGoal: SubGoal; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalRequiresSubGoal, SubGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresSubGoalLabel,
      onCreateProps: { strength: strength || 100 },
      onMergeProps: { strength },
    },
    destinationNode: { label: TopicLabel, filter: { _id: subGoalId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, subGoal: destinationNode }));

export const detachLearningGoalRequiresSubGoal = async (
  learningGoalId: string,
  subGoalId: string
): Promise<{ subGoal: SubGoal; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalRequiresSubGoal, SubGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresSubGoalLabel,
      filter: {},
    },
    destinationNode: { label: TopicLabel, filter: { _id: subGoalId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, subGoal: destinationNode }));

export const getLearningGoalRequiredSubGoals = (
  learningGoalId: string
): Promise<{
  learningGoal: LearningGoal;
  relationship: LearningGoalRequiresSubGoal;
  subGoal: SubGoal;
}[]> =>
  getRelatedNodes<LearningGoal, LearningGoalRequiresSubGoal, SubGoal>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: LearningGoalRequiresSubGoalLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: TopicLabel, // TODO: that's not clean, should be explicitely concept or learning goal
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningGoal: originNode,
      relationship,
      subGoal: destinationNode,
    }))
  );

export const getLearningGoalRequiredInGoals = (
  learningGoalId: string
): Promise<{
  learningGoal: LearningGoal;
  relationship: LearningGoalRequiresSubGoal;
  parentGoal: LearningGoal;
}[]> =>
  getRelatedNodes<LearningGoal, LearningGoalRequiresSubGoal, LearningGoal>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: LearningGoalRequiresSubGoalLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { hidden: false },
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningGoal: originNode,
      relationship,
      parentGoal: destinationNode,
    }))
  );

export const getLearningGoalCreator = (learningGoalId: string): Promise<User> =>
  getRelatedNode<User>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: UserCreatedLearningGoalLabel,
      filter: {},
      direction: 'IN',
    },
    destinationNode: {
      label: UserLabel,
      filter: {},
    },
  });

export const attachUserStartedLearningGoal = (
  userId: string,
  learningGoalId: string,
  creationData?: UserStartedLearningGoal
): Promise<{ user: User; relationship: UserStartedLearningGoal; learningGoal: LearningGoal }> =>
  attachUniqueNodes<User, UserStartedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserStartedLearningGoalLabel, onCreateProps: creationData },
    destinationNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
  }).then(({ originNode, relationship, destinationNode }) => ({
    user: originNode,
    relationship,
    learningGoal: destinationNode,
  }));

export const getUserStartedLearningGoal = (
  userId: string,
  learningGoalId: string
): Promise<UserStartedLearningGoal | null> =>
  getOptionalRelatedNode<User, UserStartedLearningGoal, LearningGoal>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserStartedLearningGoalLabel,
      direction: 'OUT',
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
  }).then(result => (result ? result.relationship : null));

export const getLearningGoalStartedBy = (
  learningGoalId: string,
  { pagination }: { pagination?: PaginationOptions }
): Promise<{ user: User; relationship: UserStartedLearningGoal }[]> =>
  getRelatedNodes<LearningGoal, UserStartedLearningGoal, User>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: UserStartedLearningGoalLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: UserLabel,
    },
    pagination,
  }).then(items =>
    items.map(({ relationship, destinationNode }) => ({
      relationship,
      user: destinationNode,
    }))
  );

export const countLearningGoalStartedBy = (learningGoalId: string): Promise<number> =>
  countRelatedNodes<LearningGoal, UserStartedLearningGoal, User>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: UserStartedLearningGoalLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: UserLabel,
    },
  });

export const getLearningGoalProgress = async (learningGoalId: string, userId: string): Promise<number> => {
  const q = new Query(neo4jQb);

  q.match([
    node('n', LearningGoalLabel, { _id: learningGoalId }),
    relation('out', 'r', LearningGoalRequiresSubGoalLabel, undefined, [1, 5]),
    node('c', ConceptLabel),
  ]);
  q.optionalMatch([node('c'), relation('in', 'k', UserKnowsConceptLabel), node('u', UserLabel, { _id: userId })]);

  q.raw('WITH DISTINCT c, k WITH size(collect(c)) as lenC, sum(k.level) as lenK ');
  q.return('CASE WHEN lenC > 0 THEN lenK/lenC ELSE 0 END  as progress');

  const r = await q.run();

  const [progress] = r.map(i => i.progress);

  return progress;
};

export const publishLearningGoal = async (learningGoalId: string): Promise<{ learningGoal: LearningGoal }> => {
  const q = new Query(neo4jQb);

  q.match([node('goal', LearningGoalLabel, { _id: learningGoalId })]);
  q.optionalMatch([
    node('goal'),
    relation('out', 'r', LearningGoalRequiresSubGoalLabel, undefined, [1, 5]),
    node('subGoal', LearningGoalLabel),
  ]);
  q.where({ 'subGoal.publishedAt': isNull() });
  q.set(
    {
      values: {
        goal: { publishedAt: Date.now(), hidden: false },
        subGoal: { publishedAt: Date.now() },
      },
    },
    { merge: true }
  );

  q.return('properties(goal) as goal');
  const r = await q.run();
  const [goal] = r.map(i => i.goal);
  return { learningGoal: goal };
};

export const getLearningMaterialsLeadingToOutcome = async (
  learningGoalId: string
): Promise<{ learningMaterial: LearningMaterial; relationship: LearningMaterialLeadsToLearningGoal }[]> =>
  getRelatedNodes<LearningGoal, LearningMaterialLeadsToLearningGoal, LearningMaterial>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: LearningMaterialLeadsToLearningGoalLabel,
    },
    destinationNode: {
      label: LearningMaterialLabel,
    },
  }).then(items =>
    items.map(({ destinationNode, relationship }) => ({ relationship, learningMaterial: destinationNode }))
  );

const averageRating = 4; // rating over 4: score is boosted, below is reduced
const cboBoost = 0.2; // if a learning material is created by the creator of the learning goal, score gains *(1+cboBoost)
export const getLearningGoalRelevantLearningMaterials = async (
  learningGoalId: string
): Promise<{ learningMaterial: LearningMaterial; score: number; coverage: number }[]> => {
  const q = new Query(neo4jQb);

  // match (own:User)-[:CREATED]->(n:LearningGoal {key: '-U1HbvROmV_lg'})-[:REQUIRES*0..5]->(req)
  // WHERE req:LearningGoal or req:Concept
  q.match([
    node('owner', UserLabel),
    relation('out', undefined, UserCreatedLearningGoalLabel),
    node('n', LearningGoalLabel, { _id: learningGoalId }),
    relation('out', undefined, LearningGoalRequiresSubGoalLabel, undefined, [0, 5]),
    node('req'),
  ]);
  q.raw(` WHERE req:${LearningGoalLabel} OR req:${ConceptLabel} `);

  // WITH collect(req.name) as req, own
  q.with(['collect(req._id) as req, owner']);

  // MATCH (cov)<-[:COVERS|LEADS_TO|REQUIRES*0..5]-(lm:LearningMaterial)<-[:CREATED]-(crea:User)
  // WHERE cov.name IN req
  q.raw(`
  MATCH (cov)<-[:${LearningMaterialCoversConceptLabel}|${LearningMaterialLeadsToLearningGoalLabel}|${LearningGoalRequiresSubGoalLabel}*0..5]-(lm:${LearningMaterialLabel})
  <-[:${UserCreatedLearningMaterialLabel}]-(crea:${UserLabel}) 
  WHERE cov._id IN req AND (lm:Resource or lm.public = true)
  `);
  //  OPTIONAL match (lm)<-[rel:RATED]-(u:User)
  q.optionalMatch([node('lm'), relation('in', 'rel', UserRatedLearningMaterialLabel), node('u', UserLabel)]);

  // WITH DISTINCT lm, collect(DISTINCT cov.name) as cov, req, CASE crea._id WHEN own._id THEN 1.0 ELSE 0.0 END as cbo, avg(rel.value) as rating
  q.with([
    'lm',
    'collect(DISTINCT cov._id) as cov',
    'req',
    'CASE crea._id WHEN owner._id THEN 1.0 ELSE 0.0 END as cbo',
    'avg(rel.value) as rating',
  ]);

  // match (lm)-[:COVERS|LEADS_TO|REQUIRES*0..5]->(off:Topic)
  q.raw(
    ` match (lm)-[:${LearningMaterialCoversConceptLabel}|${LearningMaterialLeadsToLearningGoalLabel}|${LearningGoalRequiresSubGoalLabel}*0..5]->(off:${TopicLabel}) `
  );

  // WITH DISTINCT lm, req, cov, collect(DISTINCT off.name) as off, cbo, rating
  q.with(['DISTINCT lm', 'req', 'cov', 'collect(DISTINCT off._id) as off', 'cbo', 'rating']);

  // with lm,cov, req, off,  toFloat(size(cov))/toFloat(size(req)) as coverage, toFloat(size(off))/toFloat(size(cov)) as specificity, 1+cbo*0.2 as cboBoost, CASE WHEN rating IS NUll THEN 1 ELSE rating/4.0 END as ratingBoost
  q.with([
    'lm',
    'cov',
    'req',
    'off',
    'toFloat(size(cov))/toFloat(size(req)) as coverage',
    'toFloat(size(off))/toFloat(size(cov)) as specificity',
    `1+cbo*${cboBoost} as cboBoost`,
    `CASE WHEN rating IS NUll THEN 1 ELSE rating/${averageRating} END as ratingBoost`,
  ]);

  // return lm.name as lm, req, off, cov,  coverage, specificity, coverage/specificity as fit, cboBoost, ratingBoost,  (coverage/specificity)*cboBoost*ratingBoost as score
  q.return([
    'lm',
    'req',
    'off',
    'cov',
    'coverage',
    'specificity',
    'coverage/specificity as fit',
    'cboBoost',
    'ratingBoost',
    '(coverage/specificity)*cboBoost*ratingBoost as score',
  ]);
  q.orderBy('score', 'DESC');

  const r = await q.run();
  const items = r.map(i => ({ learningMaterial: i.lm.properties, coverage: i.coverage, score: i.score }));

  return items;
};

export const attachLearningGoalDependsOnLearningGoal = async (
  learningGoalId: string,
  learningGoalDependencyId: string,
  { parentLearningGoalId }: { parentLearningGoalId: string }
): Promise<{ learningGoalDependency: LearningGoal; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalDependsOnLearningGoalInLearningGoal, LearningGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalDependsOnLearningGoalInLearningGoalLabel,
      onCreateProps: { parentLearningGoalId },
    },
    destinationNode: { label: LearningGoalLabel, filter: { _id: learningGoalDependencyId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, learningGoalDependency: destinationNode }));

export const detachLearningGoalDependsOnLearningGoal = async (
  learningGoalId: string,
  learningGoalDependencyId: string
): Promise<{ learningGoalDependency: LearningGoal; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalDependsOnLearningGoalInLearningGoal, LearningGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalDependsOnLearningGoalInLearningGoalLabel,
      filter: {},
    },
    destinationNode: { label: LearningGoalLabel, filter: { _id: learningGoalDependencyId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, learningGoalDependency: destinationNode }));

export const getLearningGoalDependencies = (
  learningGoalId: string,
  parentLearningGoalIds?: string[]
): Promise<{
  learningGoal: LearningGoal;
  relationship: LearningGoalDependsOnLearningGoalInLearningGoal;
  learningGoalDependency: LearningGoal;
}[]> =>
  getRelatedNodes<LearningGoal, LearningGoalDependsOnLearningGoalInLearningGoal, LearningGoal>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: LearningGoalDependsOnLearningGoalInLearningGoalLabel,
      direction: 'OUT',
      ...(!!parentLearningGoalIds &&
        parentLearningGoalIds.length && { filter: { parentLearningGoalId: { $in: parentLearningGoalIds } } }),
    },
    destinationNode: {
      label: LearningGoalLabel,
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningGoal: originNode,
      relationship,
      learningGoalDependency: destinationNode,
    }))
  );

export const getLearningGoalDependants = (
  learningGoalId: string,
  parentLearningGoalIds?: string[]
): Promise<{
  learningGoal: LearningGoal;
  relationship: LearningGoalDependsOnLearningGoalInLearningGoal;
  dependantLearningGoal: LearningGoal;
}[]> =>
  getRelatedNodes<LearningGoal, LearningGoalDependsOnLearningGoalInLearningGoal, LearningGoal>({
    originNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
    relationship: {
      label: LearningGoalDependsOnLearningGoalInLearningGoalLabel,
      direction: 'IN',
      ...(!!parentLearningGoalIds &&
        parentLearningGoalIds.length && { filter: { parentLearningGoalId: { $in: parentLearningGoalIds } } }),
    },
    destinationNode: {
      label: LearningGoalLabel,
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningGoal: originNode,
      relationship,
      dependantLearningGoal: destinationNode,
    }))
  );

export const rateLearningGoal = generateRateEntityMethod<LearningGoal, UserRatedLearningGoal>(
  LearningGoalLabel,
  UserRatedLearningGoalLabel
);

export const getLearningGoalRating = generateGetRatingMethod(LearningGoalLabel, UserRatedLearningGoalLabel);
