'use server';

import { InvoiceV4, ReceiptV5 } from 'mindee/src/product';

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

export const scanInvoiceByFile = async (file: File) => {};

/**
 * RECEIPTS
 */

export const scanReceiptByURL = async (fileUrl: string) => {
  const inputSource = mindee.docFromUrl(decodeURI(fileUrl));
  const respPromise = await mindee.parse(ReceiptV5, inputSource);

  return JSON.stringify(respPromise);
};

export const scanReceiptByFile = async (file: File) => {
  // const inputSource = mindee.docFromBuffer(file);
  // const respPromise = await mindee.parse(ReceiptV5, inputSource);
  // return JSON.stringify(respPromise);
};
