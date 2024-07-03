'use server';

import * as mindee from 'mindee';
import { Nango } from '@nangohq/node';

import { createMindeeClient } from '@/utils/mindee/client';
import { createClient } from '@/utils/supabase/server';

const supabase = createClient();
const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY!,
});

export async function mindeeScan(fileUrl: string) {
  const mindeeClient = createMindeeClient();

  const inputSource = await mindeeClient.docFromUrl(fileUrl);
  const respPromise = await mindeeClient.parse(
    mindee.product.InvoiceV4,
    inputSource,
  );

  return JSON.stringify(respPromise);
}

/**
 * Retrieves OAuth2 token from Nango for Google Mail
 * @returns Token for Google Mail if found, otherwise false
 */
export async function getGoogleMailToken() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    console.error('User not found');
    return;
  }

  const gmailIntegrationStatus = await supabase
    .from('users')
    .select('gmail_integration_status')
    .eq('id', data.user.id)
    .single();

  if (gmailIntegrationStatus.error) {
    throw new Error(gmailIntegrationStatus.error.message);
  }

  if (!gmailIntegrationStatus.data.gmail_integration_status) {
    console.error('Gmail integration not enabled');
    return false;
  }

  const token = await nango.getToken('google-mail', data.user?.id);

  return token;
}

export async function getQuickBooksToken() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    console.error('User not found');
    return;
  }

  const quickbooksIntegrationStatus = await supabase
    .from('users')
    .select('quickbooks_integration_status')
    .eq('id', data.user.id)
    .single();

  if (quickbooksIntegrationStatus.error) {
    throw new Error(quickbooksIntegrationStatus.error.message);
  }

  if (!quickbooksIntegrationStatus.data.quickbooks_integration_status) {
    console.error('QuickBooks integration not enabled');
    return false;
  }

  const token = await nango.getToken('quickbooks', data.user.id);

  return token;
}
