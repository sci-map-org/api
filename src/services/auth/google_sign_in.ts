import { OAuth2Client } from 'google-auth-library';
import { env } from '../../env';

const client = new OAuth2Client(env.AUTH.GOOGLE_CLIENT_ID);

export async function identifyGoogleIdToken(id_token: string): Promise<{ googleUserId: string; email: string }> {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: env.AUTH.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error('Error while identifying google sign in token');
  const googleUserId = payload['sub'];
  const email = payload.email;
  if (!email) throw new Error('No email obtained from google sign in: verify the scopes');
  return { googleUserId, email };
}
