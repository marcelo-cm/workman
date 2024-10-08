'use server';

import { PredictResponse } from 'mindee';
import { InvoiceV4 } from 'mindee/src/product';
import { NextRequest } from 'next/server';

import { badRequest, internalServerError, ok } from '@/app/api/utils';
import { InvoiceData } from '@/interfaces/common.interfaces';
import { Account, Customer, Vendor } from '@/interfaces/quickbooks.interfaces';
import { findMostSimilar } from '@/lib/utils';
import { createMindeeClient } from '@/lib/utils/mindee/client';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest) {
  const { fileUrl, invoiceId, userId } = await req.json();

  if (!fileUrl || !invoiceId || !userId) {
    return badRequest('User ID, File URL, and the Invoice ID are required');
  }

  const supabase = createClient();

  try {
    const data = await processBill(fileUrl, userId);
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

async function processBill(fileUrl: string, userId: string) {
  const mindee = createMindeeClient();

  const input = mindee.docFromUrl(decodeURI(fileUrl));
  const response = await mindee.parse(InvoiceV4, input);

  if (!response) {
    throw new Error('Failed to process the invoice');
  }

  return parseMindeeResponse(response);
}

const parseMindeeResponse = (
  response: PredictResponse<InvoiceV4>,
): InvoiceData => {
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
        polygon: item.polygon,
      })) || [],
    notes: '',
  };
};

const matchVendor = async (vendorName: string, userId: string) => {
  const response = await fetch(
    `/api/v1/quickbooks/company/vendor/all?userId=${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch vendors');
  }

  const vendors = await response.json();

  return findMostSimilar(
    vendorName,
    vendors,
    (vendor: Vendor) => vendor.DisplayName,
  );
};

const matchCustomer = async (customerName: string) => {
  const response = await fetch(`/api/v1/quickbooks/company/customer/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  const customers = await response.json();

  return findMostSimilar(
    customerName,
    customers,
    (customer: Customer) => customer.DisplayName,
  );
};

const matchAccount = async (accountName: string) => {
  const response = await fetch(`/api/v1/quickbooks/company/account/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }

  const accounts = await response.json();

  return findMostSimilar(
    accountName,
    accounts,
    (account: Account) => account.Name,
  );
};
