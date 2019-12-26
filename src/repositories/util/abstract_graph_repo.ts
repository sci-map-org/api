import { neo4jDriver } from '../../infra/neo4j';

export function getFilterString(filter: object, filterName: string = 'filter'): string {
  if (Object.keys(filter).length == 0) return '';
  const s = Object.keys(filter).reduce((acc, key, index) => {
    const filterProp = `${acc} ${key}: {${filterName}}.${key}`;
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

export const updateOne = <E, F extends Partial<E>, D extends Partial<E>>({ label }: { label: string }) => async (
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

export const getRelatedNodes = async <E>({
  originNode,
  relationship,
  destinationNode,
  pagination,
}: {
  originNode: { label: string; filter: object };
  relationship: { label: string; filter: object };
  destinationNode: { label: string; filter: object };
  pagination?: { offset?: number; limit?: number };
}): Promise<E[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(originNode.filter, 'originNodeFilter')})-[relationship:${
      relationship.label
    } ${getFilterString(relationship.filter, 'relationshipFilter')}]-(destinationNode:${
      destinationNode.label
    } ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) RETURN properties(destinationNode) as destinationNode${
      pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''
    }${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`,
    {
      originNodeFilter: originNode.filter,
      relationshipFilter: relationship.filter,
      destinationNodeFilter: destinationNode.filter,
    }
  );

  session.close();

  return records.map(r => r.get('destinationNode'));
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

export const createNode = <C, E>({ label }: { label: string }) => async (props: C): Promise<E> => {
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

export const attachNodes = async <OF extends object, RP extends object, DF extends object>({
  originNode,
  relationship,
  destinationNode,
}: {
  originNode: { label: string; filter: OF };
  relationship: { label: string; props: RP };
  destinationNode: { label: string; filter: DF };
}): Promise<RP> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(
      originNode.filter,
      'originNodeFilter'
    )}) MATCH (destinationNode:${destinationNode.label} ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) CREATE (originNode)-[relationship:${
      relationship.label
    } $relationshipProps]->(destinationNode) RETURN properties(relationship) as relationship`,
    {
      originNodeFilter: originNode.filter,
      destinationNodeFilter: destinationNode.filter,
      relationshipProps: relationship.props,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('relationship');
};
