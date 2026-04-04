"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminProfile } from "@/types/admin";

const adminNavItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/settings", label: "Settings" },
];

interface AdminShellProps {
  admin: AdminProfile;
  children: React.ReactNode;
}

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/admin/session", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,244,220,0.72),rgba(255,247,236,1))]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-white/50 bg-white/65 p-5 backdrop-blur-xl lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0 lg:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                FreshBitan
              </p>
              <h2 className="font-display text-3xl text-brand-deep">Admin</h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-brand-deep lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
            >
              Menu
            </button>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/70 bg-[linear-gradient(135deg,#fff2d3,#fff7ec)] p-5">
            <p className="text-sm font-semibold text-brand-deep">{admin.name}</p>
            <p className="mt-1 text-sm text-muted">{admin.email}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {admin.role.replace(/_/g, " ")}
            </p>
          </div>

          <nav className={cn("mt-6 space-y-2", !menuOpen && "hidden lg:block")}>
            {adminNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-sm font-semibold",
                    isActive
                      ? "bg-brand text-white shadow-[0_16px_36px_rgba(239,139,30,0.24)]"
                      : "bg-white/50 text-foreground hover:bg-white",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            type="button"
            variant="outline"
            className="mt-6 hidden w-full justify-center lg:inline-flex"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? "Signing out..." : "Logout"}
          </Button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/40 bg-white/55 px-6 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Admin dashboard
                </p>
                <p className="text-sm text-muted">
                  Manage catalog, orders, reviews, and site content.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="lg:hidden"
                onClick={handleLogout}
                disabled={isPending}
              >
                {isPending ? "Signing out..." : "Logout"}
              </Button>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
