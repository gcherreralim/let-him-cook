import { LoginForm } from "@/components/LoginForm";

// Never statically prerender this page. Auth pages need to run at request
// time (not build time), so a missing/late-added env var never fails the
// build — it would only affect the live page, with a clear error (see
// lib/supabase/client.ts) instead of a cryptic prerender crash.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginForm />;
}
