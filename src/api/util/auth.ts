import { User } from '../../entities/User';
import { RoleAccessAllowedRule, hasAccess } from '../../services/users.service';
import { UnauthorizedError } from '../errors/UnauthenticatedError';

export const restrictAccess = (
  accessRule: RoleAccessAllowedRule,
  user?: Pick<User, 'role'>,
  errorMessage?: string
): void => {
  if (!hasAccess(accessRule, user))
    throw new UnauthorizedError(errorMessage || 'You do not have the necessary permissions to perform this action');
};
