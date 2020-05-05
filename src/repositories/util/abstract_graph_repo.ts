import { neo4jDriver } from '../../infra/neo4j';
import { buildFilter, FilterObject } from './filter';

export function getFilterString(filter: object, filterName: string = 'filter'): string {
  if (Object.keys(filter).length == 0) return '';
  const s = Object.keys(filter).reduce((acc, key, index) => {
    const filterProp = `${acc} ${key}: $${filterName}.${key}`;
    if (index === 0) {
      return filterProp;
    }
    return `, ${filterProp}`;
  }, '{ ');
  return s + ' }';
}

export const findOne = <E, F extends Partial<E>>({ label }: { label: string }) => async (
  filter: F
): Promise<E | null> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${label} ${getFilterString(filter)}) RETURN properties(node) AS node`,
    {
      filter,
    }
  );
  session.close();
  const record = records.pop();

  if (!record) return null;

  return record.get('node');
};

type UpdateType<E> = {
  [key in keyof E]?: undefined extends E[key] ? E[key] | null : E[key];
};

export const updateOne = <E, F extends Partial<E>, D extends UpdateType<E>>({ label }: { label: string }) => async (
  filter: F,
  data: D
): Promise<E | null> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${label} ${getFilterString(filter)}) SET node += $props RETURN properties(node) AS node`,
    {
      filter,
      props: data,
    }
  );
  session.close();
  const record = records.pop();

  if (!record) return null;

  return record.get('node');
};

export const deleteOne = <E, F extends Partial<E>>({ label }: { label: string }) => async (
  filter: F
): Promise<{ deletedCount: number }> => {
  const session = neo4jDriver.session();
  const results = await session.run(
    `MATCH (node:${label} ${getFilterString(filter)}) DETACH DELETE node RETURN properties(node) AS node`,
    {
      filter,
    }
  );
  session.close();
  return { deletedCount: results.records.length };
};

//TODO sorting + count + direction + tests
export const getRelatedNodes = async <OriginEntity, RelationshipEntity, DestinationEntity>({
  originNode,
  relationship,
  destinationNode,
  pagination,
  sorting,
}: {
  originNode: { label: string; filter: FilterObject<OriginEntity> };
  relationship: { label: string; filter?: FilterObject<RelationshipEntity>; direction?: 'IN' | 'OUT' };
  destinationNode: { label: string; filter?: FilterObject<DestinationEntity> };
  pagination?: { offset?: number; limit?: number };
  sorting?: {
    entity: 'originNode' | 'relationship' | 'destinationNode';
    field: keyof RelationshipEntity | keyof DestinationEntity;
    direction: 'ASC' | 'DESC';
  };
  count?: boolean;
}): Promise<{
  items: Array<{
    originNode: OriginEntity;
    relationship: RelationshipEntity;
    destinationNode: DestinationEntity;
  }>;
  count?: number;
}> => {
  const session = neo4jDriver.session();
  const sortingClause = sorting ? `ORDER BY ${sorting.entity}.${sorting.field} ${sorting.direction}` : '';
  const whereClause = `WHERE ${buildFilter(originNode.filter, 'originNodeFilter', 'originNode')}
  ${
    relationship.filter && Object.keys(relationship.filter).length
      ? ' AND ' + buildFilter(relationship.filter, 'relationshipFilter', 'relationship')
      : ''
  }
  ${
    destinationNode.filter && Object.keys(destinationNode.filter).length
      ? ' AND ' + buildFilter(destinationNode.filter, 'destinationNodeFilter', 'destinationNode')
      : ''
  }`;
  const query = `MATCH (originNode:${originNode.label})-[relationship:${relationship.label}]
  -(destinationNode:${destinationNode.label}) ${whereClause} RETURN 
  properties(originNode) as originNode, 
  properties(destinationNode) as destinationNode, 
  properties(relationship) as relationship
  ${sortingClause}
  ${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}
  ${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`;
  const { records } = await session.run(query, {
    originNodeFilter: originNode.filter,
    relationshipFilter: relationship.filter,
    destinationNodeFilter: destinationNode.filter,
  });

  session.close();

  return {
    items: records.map(r => {
      return {
        originNode: r.get('originNode') as OriginEntity,
        relationship: r.get('relationship') as RelationshipEntity,
        destinationNode: r.get('destinationNode') as DestinationEntity,
      };
    }),
    count: undefined,
  };
};

export const getRelatedNode = async <E>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: object };
  relationship: { label: string; filter: object };
  destinationNode: { label: string; filter: object };
}): Promise<E> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(originNode.filter, 'originNodeFilter')})-[relationship:${
      relationship.label
    } ${getFilterString(relationship.filter, 'relationshipFilter')}]-(destinationNode:${
      destinationNode.label
    } ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) RETURN properties(destinationNode) as destinationNode`,
    {
      originNodeFilter: originNode.filter,
      relationshipFilter: relationship.filter,
      destinationNodeFilter: destinationNode.filter,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error('Not found');

  return record.get('destinationNode');
};

export const createNode = <E>({ label }: { label: string }) => async (props: E): Promise<E> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(`CREATE (node:${label} $props) RETURN properties(node) as node`, {
    props,
  });

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('node');
};

export const createRelatedNode = async <OF extends object, RP extends object, NP extends object>({
  originNode,
  relationship,
  newNode,
}: {
  originNode: { label: string; filter: OF };
  relationship: { label: string; props: RP };
  newNode: { label: string; props: NP };
}): Promise<NP> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(originNode.filter, 'originNodeFilter')}) CREATE (newNode:${
      newNode.label
    } $newNodeProps) CREATE (originNode)-[relationship:${
      relationship.label
    } $relationshipProps]->(newNode) RETURN properties(newNode) as newNode`,
    {
      originNodeFilter: originNode.filter,
      newNodeProps: newNode.props,
      relationshipProps: relationship.props,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('newNode');
};

export const updateRelatedNode = async <OF extends object, RP extends object, NP extends object>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: OF };
  relationship: { label: string; filter: RP };
  destinationNode: { label: string; filter: {}; props: NP };
}): Promise<any> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(originNode.filter, 'originNodeFilter')})-[relationship:${
      relationship.label
    } ${getFilterString(relationship.filter, 'relationshipFilter')}]-(destinationNode:${
      destinationNode.label
    } ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) SET destinationNode += $destinationNodeProps RETURN properties(destinationNode) as destinationNode`,
    {
      originNodeFilter: originNode.filter,
      relationshipFilter: relationship.filter,
      destinationNodeFilter: destinationNode.filter,
      destinationNodeProps: destinationNode.props,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error('Not found');

  return record.get('destinationNode');
};

export const deleteRelatedNode = async <OF extends object, RF extends object, DF extends object>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: OF };
  relationship: { label: string; filter: RF };
  destinationNode: { label: string; filter: DF };
}): Promise<{ deletedCount: number }> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(originNode.filter, 'originNodeFilter')})-[relationship:${
      relationship.label
    } ${getFilterString(relationship.filter, 'relationshipFilter')}]-(destinationNode:${
      destinationNode.label
    } ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) DETACH DELETE destinationNode RETURN properties(destinationNode) as destinationNode`,
    {
      originNodeFilter: originNode.filter,
      relationshipFilter: relationship.filter,
      destinationNodeFilter: destinationNode.filter,
    }
  );

  session.close();

  return {
    deletedCount: records.length,
  };
};

export const attachNodes = async <OriginNodeEntity, RelationshipEntity, DestinationNodeEntity>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: FilterObject<OriginNodeEntity> };
  relationship: {
    label: string;
    onCreateProps?: RelationshipEntity;
    onMergeProps?: UpdateType<RelationshipEntity>;
  };
  destinationNode: { label: string; filter: FilterObject<DestinationNodeEntity> };
}): Promise<{
  originNode: OriginNodeEntity;
  relationship: RelationshipEntity;
  destinationNode: DestinationNodeEntity;
}[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(
      originNode.filter,
      'originNodeFilter'
    )}) MATCH (destinationNode:${destinationNode.label} ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) MERGE (originNode)-[relationship:${relationship.label}]->(destinationNode)${
      relationship.onCreateProps ? `ON CREATE SET relationship = $relationshipOnCreateProps` : ''
    } ${relationship.onMergeProps ? 'ON MATCH SET relationship += $relationshipOnMergeProps' : ''} RETURN 
    properties(originNode) as originNode,
    properties(relationship) as relationship,
    properties(destinationNode) as destinationNode`,
    {
      originNodeFilter: originNode.filter,
      destinationNodeFilter: destinationNode.filter,
      relationshipOnCreateProps: relationship.onCreateProps,
      relationshipOnMergeProps: relationship.onMergeProps,
    }
  );

  session.close();

  return records.map(record => {
    return {
      originNode: record.get('originNode') as OriginNodeEntity,
      relationship: record.get('relationship') as RelationshipEntity,
      destinationNode: record.get('destinationNode') as DestinationNodeEntity,
    };
  });
};

export const detachNodes = async <
  OriginFilter extends object,
  RelationFilter extends object,
  DestinationFilter extends object
>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: OriginFilter };
  relationship: { label: string; filter: RelationFilter };
  destinationNode: { label: string; filter: DestinationFilter };
}) => {
  const session = neo4jDriver.session();
  const result = await session.run(
    `MATCH (originNode:${originNode.label}) WHERE ${buildFilter(
      originNode.filter,
      'originNodeFilter',
      'originNode'
    )} MATCH (destinationNode:${destinationNode.label}) WHERE ${buildFilter(
      destinationNode.filter,
      'destinationNodeFilter',
      'destinationNode'
    )} OPTIONAL MATCH (originNode)-[relationship:${
      relationship.label
    }]-(destinationNode) DELETE relationship RETURN properties(originNode) as originNode`,
    {
      originNodeFilter: originNode.filter,
      destinationNodeFilter: destinationNode.filter,
    }
  );

  const { records } = result;
  session.close();
  const record = records.pop();

  if (!record) throw new Error();

  return record.get('originNode');
};
