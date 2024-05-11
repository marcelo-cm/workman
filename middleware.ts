import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";
import { UserResponse } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const { data }: UserResponse = await supabase.auth.getUser();

  const nonAuthPaths = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/error",
  ];

  const url = request.nextUrl.clone();
  const validPath = nonAuthPaths.includes(url.pathname);

  if (!data.user && !validPath) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (data.user && validPath) {
    url.pathname = "/for-approval";
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
