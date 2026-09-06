import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/integrations/supabase/server';
import { safeRedirect } from '@/lib/safe-redirect';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = safeRedirect(request.nextUrl.searchParams.get('next'));
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL('/auth?error=callback', request.url));
}
