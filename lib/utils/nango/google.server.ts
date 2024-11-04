'use server';

import { Connection } from '@nangohq/node';
import { UUID } from 'crypto';

import { createServerClient } from './server';

const nango = createServerClient();

export const getGmailToken = async (userId: UUID | string) => {
  try {
    const token = await nango.getToken('google-mail', userId);
    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
};
