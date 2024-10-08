'use server';

import { InvoiceV4 } from 'mindee/src/product';
import { NextRequest } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import { InvoiceData } from '@/interfaces/common.interfaces';
import { createMindeeClient } from '@/lib/utils/mindee/client';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest) {
  const { fileUrl, invoiceId } = await req.json();

  if (!fileUrl || !invoiceId) {
    return badRequest('User ID, File URL, and the Invoice ID are required');
  }

  const supabase = createClient();

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
  const mindee = createMindeeClient();

  const input = mindee.docFromUrl(decodeURI(fileUrl));
  const response = await mindee.parse(InvoiceV4, input);

  if (!response) {
    throw new Error('Failed to process the invoice');
  }

  const prediction = response.document.inference.prediction;

  const parsedResponse: InvoiceData = {
    date: prediction.date?.value || '',
    dueDate: prediction.dueDate?.value || '',
    invoiceNumber: prediction.invoiceNumber?.value || '',
    supplierName: prediction.supplierName?.value || '',
    supplierAddress: prediction.supplierAddress?.value || '',
    supplierEmail: prediction.supplierEmail?.value || '',
    supplierPhoneNumber: prediction.supplierPhoneNumber?.value || '',
    customerAddress: prediction.customerAddress?.value || '',
    customerName: prediction.customerName?.value || '',
    shippingAddress: prediction.shippingAddress?.value || '',
    totalNet: prediction.totalNet?.value || 0,
    totalAmount: prediction.totalAmount?.value || 0,
    totalTax: prediction.totalTax?.value?.toFixed(2) || '0',
    lineItems:
      prediction.lineItems?.map((item) => ({
        confidence: item.confidence || 0,
        description: item.description || '',
        productCode: item.productCode || '',
        quantity: item.quantity || 0,
        totalAmount: item?.totalAmount?.toFixed(2) || '0',
        unitPrice: item.unitPrice || 0,
        pageId: item.pageId || 0,
        polygon: item.polygon,
      })) || [],
    notes: '',
  };

  return parsedResponse;
}
