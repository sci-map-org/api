import { LearningGoal } from '../../entities/LearningGoal';
import { LearningPath } from '../../entities/LearningPath';
import { env } from '../../env';
import { findLearningGoal } from '../../repositories/learning_goals.repository';
import { findLearningPath } from '../../repositories/learning_paths.repository';
import { getTopicById, getTopicByKey } from '../../repositories/topics.repository';
import { findUser } from '../../repositories/users.repository';
import { searchEntities } from '../../services/search.service';
import { APIQueryResolvers } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';

const splitArray = (s?: string) => (!s ? [] : s.split(','));

// TODO: optimize queries made
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

export const globalSearchResolver: APIQueryResolvers['globalSearch'] = async (_, { query, options }) => {
  const results = await searchEntities(query, !!options?.pagination ? nullToUndefined(options.pagination) : undefined);
  return {
    results,
  };
};

export const getTopLevelTopicsResolver: APIQueryResolvers['getTopLevelTopics'] = async (_, {}) => {
  const topLevelTopicsKeys = env.OTHER.TOP_LEVEL_TOPICS_KEYS.split(',');
  return {
    items: await Promise.all(
      topLevelTopicsKeys.map(async key => {
        const d = await getTopicByKey(key);
        if (!d) throw new Error(`Topic with key ${key} not found`);
        return d;
      })
    ),
  };
};
