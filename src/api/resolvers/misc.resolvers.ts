import { LearningGoal } from '../../entities/LearningGoal';
import { LearningPath } from '../../entities/LearningPath';
import { env } from '../../env';
import { findLearningGoal } from '../../repositories/learning_goals.repository';
import { findLearningPath } from '../../repositories/learning_paths.repository';
import { findUser } from '../../repositories/users.repository';
import { APIQueryResolvers } from '../schema/types';

const splitArray = (s?: string) => (!s ? [] : s.split(','));

export const getHomePageDataResolver: APIQueryResolvers['getHomePageData'] = async (_, _2, { user }) => {
  return {
    currentUser: user ? await findUser({ key: user.key }) : undefined,
    recommendedLearningGoals: await Promise.all(
      splitArray(env.HOME.RECOMMENDED_LEARNING_GOALS_IDS || '').map(lgId => findLearningGoal({ _id: lgId }))
    ).then(results => results.filter(lg => !!lg) as LearningGoal[]),
    recommendedLearningPaths: await Promise.all(
      splitArray(env.HOME.RECOMMENDED_LEARNING_PATHS_IDS || '').map(lpId => findLearningPath({ _id: lpId }))
    ).then(results => results.filter(lp => !!lp) as LearningPath[]),
  };
};
