"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest } from "@/lib/admin-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminOrder } from "@/types/admin";

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      const data = await adminRequest<AdminOrder[]>("/api/admin/backend/orders");
      setOrders(data);
      setSelectedOrder((current) => (current ? data.find((order) => order.id === current.id) ?? null : null));
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load orders.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const openOrder = async (orderId: string) => {
    try {
      const order = await adminRequest<AdminOrder>(`/api/admin/backend/orders/${orderId}`);
      setSelectedOrder(order);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load order details.",
      });
    }
  };

  const updateStatus = (orderId: string, path: "status" | "payment-status", value: string) => {
    startTransition(async () => {
      try {
        await adminRequest(`/api/admin/backend/orders/${orderId}/${path}`, {
          method: "PATCH",
          body: path === "status" ? { status: value } : { paymentStatus: value },
        });

        setFeedback({
          tone: "success",
          message: path === "status" ? "Order status updated." : "Payment status updated.",
        });
        await loadOrders();
        await openOrder(orderId);
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not update order.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Orders"
        title="Order operations"
        description="Track customer orders, inspect line items, and update order or payment status using the existing backend order APIs."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <h2 className="text-xl font-semibold text-brand-deep">All orders</h2>

          {isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-20 rounded-3xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No orders found"
                description="Orders placed through checkout will appear here automatically."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Order status</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">View</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/70 last:border-b-0">
                      <td className="py-4">
                        <p className="font-semibold text-brand-deep">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="py-4">
                        <p>{order.customerName}</p>
                        <p className="mt-1 text-xs text-muted">{order.customerPhone}</p>
                      </td>
                      <td className="py-4">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-4">
                        <select
                          value={order.status}
                          onChange={(event) => updateStatus(order.id, "status", event.target.value)}
                          className="rounded-2xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                          disabled={isPending}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(event) => updateStatus(order.id, "payment-status", event.target.value)}
                          className="rounded-2xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                          disabled={isPending}
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4">
                        <button
                          type="button"
                          className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                          onClick={() => void openOrder(order.id)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <h2 className="text-xl font-semibold text-brand-deep">Order details</h2>

          {!selectedOrder ? (
            <div className="mt-6">
              <EmptyState
                title="Select an order"
                description="Choose any order from the table to inspect customer and line-item details."
              />
            </div>
          ) : (
            <div className="mt-6 space-y-5 text-sm">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="font-semibold text-brand-deep">{selectedOrder.orderNumber}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AdminStatusBadge tone={selectedOrder.status === "delivered" ? "success" : "warning"}>
                    {selectedOrder.status}
                  </AdminStatusBadge>
                  <AdminStatusBadge tone={selectedOrder.paymentStatus === "paid" ? "success" : "default"}>
                    {selectedOrder.paymentStatus}
                  </AdminStatusBadge>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="font-semibold text-brand-deep">Customer</p>
                <p className="mt-3">{selectedOrder.customerName}</p>
                <p className="mt-1 text-muted">{selectedOrder.customerPhone}</p>
                <p className="mt-1 text-muted">{selectedOrder.customerEmail ?? "No email provided"}</p>
                <p className="mt-3 leading-7 text-muted">{selectedOrder.shippingAddress}</p>
                <p className="mt-1 text-muted">
                  {[selectedOrder.area, selectedOrder.district].filter(Boolean).join(", ") || "No area details"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="font-semibold text-brand-deep">Items</p>
                <div className="mt-4 space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-border/70 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-brand-deep">{item.productName}</p>
                          <p className="mt-1 text-xs text-muted">
                            {item.optionLabel ? `${item.optionLabel} · ` : ""}Qty {item.quantity} x {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-border pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted">Delivery fee</span>
                    <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-semibold text-brand-deep">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
