"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { bearLogo } from "@/lib/illustrations";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "err" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) { router.push("/"); router.refresh(); }
        else {
          setMsg({ type: "ok", text: "Check your email to confirm your account, then sign in." });
          setMode("signin");
        }
      }
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 grid h-[110px] w-[110px] place-items-center rounded-full border-[2.5px] border-ink bg-cream shadow-cardsm [&>svg]:h-[88px] [&>svg]:w-[88px]"
            dangerouslySetInnerHTML={{ __html: bearLogo(88) }}
          />
          <h1 className="font-hand text-4xl">Gabby&apos;s Cookbook</h1>
        </div>

        <div className="paper-card p-6">
          <div className="mb-5 flex rounded-xl border-2 border-ink bg-paper p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMsg(null); }}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-bold transition ${mode === m ? "bg-tomato text-cream" : "text-inksoft hover:text-ink"}`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" required autoComplete="email" className="field"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" required minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"} className="field"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {msg && (
              <p className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${msg.type === "err" ? "border-tomato bg-tomato/10 text-tomatodeep" : "border-sage bg-sage/10 text-sagedeep"}`}>
                {msg.text}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-tomato w-full py-3">
              {busy ? "One sec…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
        <p className="mt-5 text-center text-xs font-semibold text-muted">Recipes are private to your account.</p>
      </div>
    </main>
  );
}
