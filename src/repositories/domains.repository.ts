import * as shortid from 'shortid';

import { Domain } from '../entities/Domain';
import { createRelatedNode, findOne, updateOne } from './util/abstract_graph_repo';

const label = 'Domain';

interface CreateDomainData {
  key: string;
  name: string;
}

interface UpdateDomainData {
  key?: string;
  name?: string;
}

export const createDomain = (user: { _id: string } | { key: string }, data: CreateDomainData): Promise<Domain> =>
  createRelatedNode({
    originNode: { label: 'User', filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label, props: { ...data, _id: shortid.generate() } },
  });

export const findDomain = findOne<Domain, { key: string } | { _id: string }>({ label });

export const updateDomain = updateOne<Domain, { _id: string } | { key: string }, UpdateDomainData>({ label });
