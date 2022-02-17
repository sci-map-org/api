import { generateUrlKey } from '../src/api/util/urlKey';
import { neo4jDriver } from '../src/infra/neo4j';
import { updateResource } from '../src/repositories/resources.repository';

const run = async () => {
  const session = neo4jDriver.session();

  const { records } = await session.run(`match (n:Resource) return n`);

  session.close();
  await Promise.all(
    records
      .map((record) => record.get('n').properties)
      .map((resource) =>
        updateResource({ _id: resource._id }, { key: resource._id + '_' + generateUrlKey(resource.name) })
      )
  );
  console.log('done');
  process.exit();
};

run();
