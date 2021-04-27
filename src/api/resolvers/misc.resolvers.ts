import { LearningGoal } from '../../entities/LearningGoal';
import { LearningPath } from '../../entities/LearningPath';
import { env } from '../../env';
import { findDomain } from '../../repositories/domains.repository';
import { findLearningGoal } from '../../repositories/learning_goals.repository';
import { findLearningPath } from '../../repositories/learning_paths.repository';
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

export const getTopLevelDomainsResolver: APIQueryResolvers['getTopLevelDomains'] = async (_, {}) => {
  return {
    items: await Promise.all(
      ['functional_programming', 'machine_learning', 'design'].map(async key => {
        const d = await findDomain({ key });
        if (!d) throw new Error(`Domain with key ${key} not found`);
        return d;
      })
    ),
  };
};
