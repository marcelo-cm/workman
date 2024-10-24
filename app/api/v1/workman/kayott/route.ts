import { NextRequest, NextResponse } from 'next/server';

import { scanReceiptByURL } from '@/lib/hooks/useOpenAI';

import { ok } from '@/app/api/utils';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createClient();
  const data = await req.json();

  const response = await supabase
    .from('temp')
    .insert({ payload: data })
    .select('*');

  const fileURL = data.file;

  const scanResponse = scanReceiptByURL(fileURL);

  const uploadScan = await supabase
    .from('temp')
    .insert({ data_scan: scanResponse })
    .select('*');

  return ok({ payload: response, scan: uploadScan });
}
