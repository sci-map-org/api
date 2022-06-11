import { flatten } from 'flat';
import { readFileSync } from 'fs';
const mjml2html = require('mjml');
import { join } from 'path';
import { User } from '../../entities/User';

export enum EmailTemplateName {
  WELCOME = 'WELCOME',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

const EmailTemplatePathMapping: { [key in EmailTemplateName]: string } = {
  WELCOME: './templates/welcome.mjml',
  VERIFY_EMAIL: './templates/verify_email.mjml',
};

export type EmailTemplateVariables = {
  [EmailTemplateName.WELCOME]: {
    user: User;
    frontendBaseUrl: string;
    discordInviteLink: string;
  };
  [EmailTemplateName.VERIFY_EMAIL]: {
    frontendBaseUrl: string;
    token: string;
  };
};

export const generateHtmlFromTemplate = <T extends EmailTemplateName>(
  templateName: T,
  variables: EmailTemplateVariables[T]
): string => {
  const template = readTemplate(templateName);
  const flattenedVariables: object = flatten(variables);
  const populatedTemplate = Object.keys(flattenedVariables).reduce((templateAcc, varName) => {
    return templateAcc.replace(new RegExp(`{{${varName}}}`, 'g'), flattenedVariables[varName]);
  }, template);

  const result = mjml2html(populatedTemplate, { filePath: join(__dirname, 'templates') });
  return result.html;
};

export const readTemplate = (templateName: EmailTemplateName): string => {
  return readFileSync(join(__dirname, EmailTemplatePathMapping[templateName]), { encoding: 'utf8' });
};
