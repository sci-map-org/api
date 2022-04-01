import { APIDiscussionLocation } from '../api/schema/types';

export const buildDiscussionId = (discussionLocation: APIDiscussionLocation, entityId: string) => {
  return `${discussionLocation}:${entityId}`;
};

export const parseDiscussionId = (discussionId: string): [APIDiscussionLocation, string] => {
  const [discussionLocation, entityId, ...rest] = discussionId.split(':');
  if (rest.length > 0) throw new Error(`Invalid discussionId ${discussionId}: contains more than 1 column`);
  return [discussionLocation as APIDiscussionLocation, entityId];
};
