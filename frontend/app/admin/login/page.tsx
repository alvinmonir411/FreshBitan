import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.2rem] border border-white/40 bg-[linear-gradient(135deg,#fff2d3,#ffd795)] p-8 shadow-[0_24px_60px_rgba(142,79,18,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-deep">
            FreshBitan admin
          </p>
          <h2 className="mt-5 font-display text-4xl text-brand-deep sm:text-5xl">
            Manage the store without exposing your JWT to the browser.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-8 text-[#73481f] sm:text-base">
            This dashboard signs in through the existing NestJS auth API and keeps the
            backend access token in a secure HttpOnly session cookie for protected admin
            requests.
          </p>
        </section>

        <AdminLoginForm />
      </div>
    </main>
  );
}
