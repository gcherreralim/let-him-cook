import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase isn't configured: NEXT_PUBLIC_SUPABASE_URL and/or " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. In Vercel, add them under " +
      "Project → Settings → Environment Variables, then redeploy."
    );
  }

  return createBrowserClient(url, key);
}
