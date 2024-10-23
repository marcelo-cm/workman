'use server';

import { PredictResponse } from 'mindee';
import { InvoiceV4 } from 'mindee/src/product';
import { NextRequest, NextResponse } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import { InvoiceStatus } from '@/constants/enums';
import { InvoiceData } from '@/interfaces/common.interfaces';
import { createMindeeClient } from '@/lib/utils/mindee/client';
import { createClient } from '@/lib/utils/supabase/server';
import Invoice from '@/models/Invoice';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<InvoiceData | unknown>> {
  const {
    fileURLs,
    userId,
  }: {
    fileURLs: string[];
    userId: string;
  } = await req.json();

  if (!fileURLs || !userId) {
    return badRequest('User ID and File URL are required');
  }

  try {
    const startTime = Date.now();
    const response = [];

    for (const fileURL of fileURLs) {
      const processedBill = await processBill(fileURL);
      response.push(processedBill);
    }

    const endTime = Date.now();
    console.log(
      'Time taken to process and update invoice:',
      endTime - startTime,
    );

    return ok(response);
  } catch (e: unknown) {
    console.error(e);
    return internalServerError('Failed to process the invoice');
  }
}

async function processBill(fileURL: string): Promise<Invoice> {
  const supabase = createClient();
  const startTime = Date.now();
  const mindee = createMindeeClient();

  const input = mindee.docFromUrl(decodeURI(fileURL));
  const response = await mindee.parse(InvoiceV4, input);

  if (!response) {
    throw new Error('Failed to process the invoice');
  }

  const endTime = Date.now();

  console.log('Time taken to process invoices:', endTime - startTime);
  const invoiceData = await parseMindeeResponse(response);

  const { data: invoice } = await supabase
    .from('invoices')
    .upsert(
      {
        data: invoiceData,
        file_url: fileURL,
        status: InvoiceStatus.FOR_REVIEW,
      },
      {
        onConflict: 'file_url',
      },
    )
    .select('*, principal: users(name, email, id), company: companies(*)')
    .single();

  return invoice;
}

const parseMindeeResponse = async (
  response: PredictResponse<InvoiceV4>,
): Promise<InvoiceData> => {
  const prediction = response.document.inference.prediction;

  return {
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
        billable: true,
      })) || [],
    notes: '',
  };
};
