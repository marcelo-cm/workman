import { UserResponse } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/lib/utils/supabase/middleware';
import { createClient } from '@/lib/utils/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const { data }: UserResponse = await supabase.auth.getUser();

  if (!data.user) {
    const url = new URL(request.url);
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/settings(/.*)?',
    '/bills(/.*)?',
  ],
};
