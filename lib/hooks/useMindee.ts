'use server';

import { InvoiceV4 } from 'mindee/src/product';

import { createMindeeClient } from '../utils/mindee/client';

/**
 * Mindee client only works on the server side
 */

const mindee = createMindeeClient();

/**
 * INVOICES
 */

export const scanInvoiceByURL = async (fileUrl: string) => {
  const inputSource = mindee.docFromUrl(decodeURI(fileUrl));
  const respPromise = await mindee.parse(InvoiceV4, inputSource);

  return JSON.stringify(respPromise);
};
