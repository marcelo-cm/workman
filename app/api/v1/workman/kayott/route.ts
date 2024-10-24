import { NextRequest, NextResponse } from 'next/server';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

import { scanReceiptByURL } from '@/lib/hooks/useOpenAI';

import { ok } from '@/app/api/utils';
import { ReceiptDataSchema } from '@/interfaces/common.interfaces';
import { createClient as createOpenAIClient } from '@/lib/utils/openai/client';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createSupabaseClient();
  const openai = createOpenAIClient();
  const data = await req.json();

  const response = await supabase
    .from('temp')
    .insert({ payload: data })
    .select('*');

  const fileURL = data.file;
  const ReceiptDataFormat = zodResponseFormat(ReceiptDataSchema, 'ReceiptData');

  const scanResponse = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Scan this receipt and return a structured JSON of the provided schema. Total Net includes the total amount and total tax and fees with no currency symbol included. customerName should always be 'Unassigned'. Description should be concise. Date is in YYYY-MM-DD format.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: fileURL,
              detail: 'low',
            },
          },
        ],
      },
    ],
    response_format: ReceiptDataFormat,
  });

  const uploadScan = await supabase
    .from('temp')
    .insert({ data_scan: scanResponse })
    .select('*');

  return ok({ payload: response, scan: uploadScan });
}
