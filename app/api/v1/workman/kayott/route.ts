import { NextRequest, NextResponse } from 'next/server';

import { ok } from '@/app/api/utils';
import { createClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createClient();
  const data = req;

  const response = await supabase
    .from('temp')
    .insert({ payload: data })
    .select('*');

  return ok(response);
}
