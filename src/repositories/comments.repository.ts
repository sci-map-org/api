import { Comment } from '../entities/Comment';
import { NotFoundError } from '../errors/NotFoundError';
import { getPostgresConnection } from '../infra/postgres';
import { PaginationOptions } from './util/pagination';

const getCommentRepository = () => getPostgresConnection().then((connection) => connection.getRepository(Comment));

interface CreateCommentData {
  contentMarkdown: string;
  discussionId: string;
  parentId?: string;
}
export const createComment = async (
  { contentMarkdown, discussionId, parentId }: CreateCommentData,
  userId: string
): Promise<Comment> => {
  const commentRepository = await getCommentRepository();
  const result = await commentRepository.insert({
    content_markdown: contentMarkdown,
    discussion_id: discussionId,
    parent_id: parentId,
    author_id: userId,
  });

  if (!result.generatedMaps[0]._id) throw new Error('No returned _id on comment creation');
  const createdCommentId = result.generatedMaps[0]._id as string;

  const createdComment = await findCommentById(createdCommentId);
  if (!createdComment) throw new Error('Failed retrieving the newly created comment ' + createdCommentId);
  return createdComment;
};

export const findCommentById = async (commentId: string): Promise<Comment | null> => {
  const commentRepository = await getCommentRepository();
  const result = await commentRepository.findOne(commentId);

  return result || null;
};

export const getCommentChildren = async (parentCommentId: string): Promise<Comment[]> => {
  const commentRepository = await getCommentRepository();
  const results = await commentRepository.find({
    where: {
      parent_id: parentCommentId,
    },
    order: {
      created_at: 'DESC',
    },
  });
  return results;
};

export const getCommentChildrenCount = async (parentCommentId: string): Promise<number> => {
  const commentRepository = await getCommentRepository();
  const results = await commentRepository.count({
    where: {
      parent_id: parentCommentId,
    },
  });
  return results;
};
export const findCommentsByDiscussionId = async (
  discussionId: string,
  pagination?: PaginationOptions
): Promise<{ items: Comment[]; totalCount: number; rootCommentsTotalCount: number }> => {
  const commentRepository = await getCommentRepository();
  const paginationOptions: Required<PaginationOptions> = {
    limit: 20,
    offset: 0,
    ...pagination,
  };

  return {
    items: await commentRepository.find({
      where: {
        discussion_id: discussionId,
        parent_id: null,
      },
      take: paginationOptions.limit,
      skip: paginationOptions.offset,
      order: {
        created_at: 'DESC',
      },
    }),
    totalCount: await commentRepository.count({
      where: {
        discussion_id: discussionId,
      },
    }),
    rootCommentsTotalCount: await commentRepository.count({
      where: {
        discussion_id: discussionId,
        parent_id: null,
      },
    }),
  };
};

export const updateComment = async (commentId: string, data: { contentMarkdown: string }): Promise<Comment> => {
  const commentRepository = await getCommentRepository();
  const comment = await commentRepository.findOne(commentId);
  if (!comment) throw new NotFoundError('Comment', commentId);
  comment.content_markdown = data.contentMarkdown;
  comment.last_updated_at = new Date();
  await commentRepository.save(comment);

  return comment;
};
