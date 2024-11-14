'use server';

import { Connection } from '@nangohq/node';
import { UUID } from 'crypto';

import { createServerClient } from './server';

const nango = createServerClient();

export const getQuickBooksRealmId = async (companyId: UUID | string) => {
  try {
    let connection;

    if (companyId === 'f28d181c-0154-4aa7-88f8-8c9aa765e8ab') {
      connection = await nango.getConnection(
        'quickbooks',
        '3fed9c01-ce90-45f8-8048-e123c74de69b',
      );
    } else {
      connection = await nango.getConnection('quickbooks', companyId);
    }

    return connection.connection_config.realmId;
  } catch (e: unknown) {
    console.error(e);
    return null;
  }
};

export const getQuickBooksToken = async (companyId: UUID | string) => {
  try {
    let token;

    if (companyId === 'f28d181c-0154-4aa7-88f8-8c9aa765e8ab') {
      token = await nango.getToken(
        'quickbooks',
        '3fed9c01-ce90-45f8-8048-e123c74de69b',
      );
    } else {
      token = await nango.getToken('quickbooks', companyId);
    }
    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
};
