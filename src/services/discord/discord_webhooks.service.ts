import * as Discord from 'discord.js';
import { env } from '../../env';
import { logger } from '../../infra/logger';

// export const discordNotifyError = new Discord.WebhookClient('webhook id', 'webhook token');

const botsChannelWebhook =
  env.DISCORD.BOTS_WEBHOOK_ID && env.DISCORD.BOTS_WEBHOOK_TOKEN
    ? new Discord.WebhookClient(env.DISCORD.BOTS_WEBHOOK_ID, env.DISCORD.BOTS_WEBHOOK_TOKEN)
    : null;

export const sendDiscordNotification = (message: string) => {
  if (botsChannelWebhook) {
    return botsChannelWebhook.send(message);
  }
  logger.debug('No env vars for discord bots channel webhook, notification ignored');
};
