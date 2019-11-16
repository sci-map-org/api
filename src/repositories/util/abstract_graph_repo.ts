import { neo4jDriver } from '../../infra/neo4j';

export function getFilterString(filter: object): string {
  const s = Object.keys(filter).reduce((acc, key, index) => {
    if (index === 0) {
      return `${acc} ${key}: {filter}.${key}`;
    }
    return `, ${acc} ${key}: {filter}.${key}`;
  }, '{ ');
  return s + ' }';
}

export const findOne = <E>({ label }: { label: string }) => async (filter: object): Promise<E | null> => {
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
