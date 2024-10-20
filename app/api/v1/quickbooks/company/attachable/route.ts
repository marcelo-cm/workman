import { NextRequest } from 'next/server';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '@/app/api/utils';
import {
  getQuickBooksRealmId,
  getQuickBooksToken,
} from '@/lib/utils/nango/quickbooks.server';

export async function POST(req: NextRequest) {
  const {
    userId,
    invoiceId,
    invoiceURL,
  }: {
    userId: string;
    invoiceId: string;
    invoiceURL: string;
  } = await req.json();

  if (!userId || !invoiceId || !invoiceURL) {
    return badRequest('User ID, Invoice ID, and Invoice URL are required.');
  }

  try {
    const quickbooksToken = await getQuickBooksToken(userId);

    if (!quickbooksToken) {
      return unauthorized('QuickBooks token not found');
    }

    const quickbooksRealmId = await getQuickBooksRealmId(userId);

    if (!quickbooksRealmId) {
      return unauthorized('QuickBooks realm ID not found');
    }

    const attachable = getBase64FromURL(invoiceURL);
    const response = await sendAttachableToQuickBooks(
      quickbooksRealmId,
      String(quickbooksToken),
      attachable,
    );

    return ok(response);
  } catch (e: unknown) {
    console.log(e);
    return internalServerError('Failed to upload bill to Quickbooks');
  }
}

const getBase64FromURL = async (invoiceURL: string) => {
  const response = await fetch(invoiceURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch the PDF: ${response.statusText}`);
  }

  // Convert the response into a Blob
  const blob = await response.blob();

  // Create a FileReader to convert Blob to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Once reading is complete, get the Base64 result
    reader.onloadend = () => resolve(reader.result as string);

    // On error, reject the promise
    reader.onerror = reject;

    // Read the Blob as a Base64 string
    reader.readAsDataURL(blob);
  });
};

const sendAttachableToQuickBooks = async (
  realmId: string,
  token: string,
  attachable: any,
) => {};
