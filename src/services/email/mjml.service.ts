import { flatten } from 'flat';
import { readFileSync } from 'fs';
const mjml2html = require('mjml');
import { join } from 'path';
import { User } from '../../entities/User';

export enum EmailTemplateName {
  WELCOME = 'WELCOME',
}

const EmailTemplatePathMapping: { [key in EmailTemplateName]: string } = {
  WELCOME: './templates/welcome.mjml',
};
export type EmailTemplateVariables = {
  [EmailTemplateName.WELCOME]: {
    user: User;
    frontendBaseUrl: string;
    discordInviteLink: string;
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
  console.log(result);
  return result.html;
};

export const readTemplate = (templateName: EmailTemplateName): string => {
  return readFileSync(join(__dirname, EmailTemplatePathMapping[templateName]), { encoding: 'utf8' });
};
