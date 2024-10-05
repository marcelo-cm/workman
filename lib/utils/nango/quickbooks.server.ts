'use server';

import { Connection } from '@nangohq/node';
import { UUID } from 'crypto';

import { createServerClient } from './server';

const nango = createServerClient();

export const getQuickBooksRealmId = async (userId: UUID | string) => {
  try {
    const connection: Connection = await nango.getConnection(
      'quickbooks',
      userId,
    );

    return connection.connection_config.realmId;
  } catch (e: unknown) {
    console.error(e);
    return null;
  }
};

export const getQuickBooksToken = async (userId: UUID | string) => {
  try {
    const token = await nango.getToken('quickbooks', userId);
    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
};
