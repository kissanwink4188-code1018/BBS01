import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { tryGetSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types/database";

const isProtectedPath = (pathname: string): boolean =>
  pathname === "/posts/new" ||
  /^\/posts\/\d+\/edit$/.test(pathname);

const handleMissingEnv = (request: NextRequest): NextResponse => {
  if (isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
};

export const updateSession = async (
  request: NextRequest,
): Promise<NextResponse> => {
  const env = tryGetSupabaseEnv();

  if (!env) {
    return handleMissingEnv(request);
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient<Database>(env.url, env.key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isProtectedPath(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    return handleMissingEnv(request);
  }
};
