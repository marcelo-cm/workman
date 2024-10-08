import { InvoiceV4 } from 'mindee/src/product';
import { NextRequest } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import { createMindeeClient } from '@/lib/utils/mindee/client';
import { createClient } from '@/lib/utils/supabase/server';

const supabase = createClient();
const mindee = createMindeeClient();

export async function POST(req: NextRequest) {
  const { fileUrl, invoiceId } = await req.json();

  if (!fileUrl || !invoiceId) {
    return badRequest('User ID, File URL, and the Invoice ID are required');
  }

  try {
    const data = await processBill(fileUrl, invoiceId);
    const response = await supabase
      .from('invoices')
      .update({ data })
      .eq('id', invoiceId)
      .select('data');

    return ok(response);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to process the invoice');
  }
}

async function processBill(fileUrl: string, invoiceId: string) {
  const input = mindee.docFromUrl(decodeURI(fileUrl));
  const response = await mindee.parse(InvoiceV4, input);

  if (!response) {
    throw new Error('Failed to process the invoice');
  }

  return response;
}
