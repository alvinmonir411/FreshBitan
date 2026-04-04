"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest } from "@/lib/admin-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminDashboardSummary, AdminOrder, AdminProduct } from "@/types/admin";

const buildSummary = (
  products: AdminProduct[],
  orders: AdminOrder[],
): AdminDashboardSummary => ({
  totalProducts: products.length,
  totalOrders: orders.length,
  pendingOrders: orders.filter((order) => order.status === "pending").length,
  deliveredOrders: orders.filter((order) => order.status === "delivered").length,
  latestOrders: orders.slice(0, 5),
});

export function AdminDashboardOverview() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [products, orders] = await Promise.all([
          adminRequest<AdminProduct[]>("/api/admin/backend/products"),
          adminRequest<AdminOrder[]>("/api/admin/backend/orders"),
        ]);

        if (active) {
          setSummary(buildSummary(products, orders));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard.");
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="Operations snapshot"
        description="A practical summary of products and order flow, derived directly from the existing backend endpoints."
      />

      {error ? (
        <EmptyState title="Dashboard unavailable" description={error} />
      ) : !summary ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-32 rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total products", value: summary.totalProducts },
              { label: "Total orders", value: summary.totalOrders },
              { label: "Pending orders", value: summary.pendingOrders },
              { label: "Delivered orders", value: summary.deliveredOrders },
            ].map((card) => (
              <article
                key={card.label}
                className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]"
              >
                <p className="text-sm font-semibold text-muted">{card.label}</p>
                <p className="mt-4 font-display text-4xl text-brand-deep">{card.value}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
            <div>
              <h2 className="text-xl font-semibold text-brand-deep">Latest orders</h2>
              <p className="mt-1 text-sm text-muted">
                Recent backend orders with quick status visibility.
              </p>
            </div>

            {summary.latestOrders.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No orders yet"
                  description="As new checkout orders arrive, they will appear here automatically."
                />
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.latestOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/70 last:border-b-0">
                        <td className="py-4 font-semibold text-brand-deep">{order.orderNumber}</td>
                        <td className="py-4">{order.customerName}</td>
                        <td className="py-4 text-muted">{formatDate(order.createdAt)}</td>
                        <td className="py-4">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-4">
                          <AdminStatusBadge
                            tone={order.status === "delivered" ? "success" : "warning"}
                          >
                            {order.status}
                          </AdminStatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
