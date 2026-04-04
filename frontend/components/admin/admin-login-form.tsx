"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-client";
import { AdminSession } from "@/types/admin";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{
    tone: "error" | "success";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      try {
        await adminRequest<AdminSession>("/api/admin/session", {
          method: "POST",
          body: { email, password },
        });

        const nextPath = searchParams.get("next");
        setFeedback({
          tone: "success",
          message: "Login successful. Redirecting to the dashboard...",
        });
        router.push(nextPath && nextPath.startsWith("/admin") ? nextPath : "/admin");
        router.refresh();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Login failed.",
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/50 bg-white/75 p-8 shadow-[0_24px_60px_rgba(142,79,18,0.12)] backdrop-blur-xl sm:p-10"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Secure access
        </p>
        <h1 className="font-display text-4xl text-brand-deep">Admin login</h1>
        <p className="text-sm leading-7 text-muted">
          Sign in with your existing backend admin account to manage products, orders,
          reviews, and site settings.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-brand-deep">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="admin@freshbitan.com"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-brand-deep">Password</span>
          <input
            type="password"
            required
            minLength={5}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="Enter your password"
          />
        </label>
      </div>

      {feedback ? (
        <div className="mt-6">
          <AdminFeedback tone={feedback.tone} message={feedback.message} />
        </div>
      ) : null}

      <Button type="submit" fullWidth className="mt-6" disabled={isPending}>
        {isPending ? "Signing in..." : "Login to dashboard"}
      </Button>
    </form>
  );
}
