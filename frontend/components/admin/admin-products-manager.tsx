"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest, isValidUrl, slugify } from "@/lib/admin-client";
import { formatCurrency, getPrimaryProductImage } from "@/lib/utils";
import { AdminCategory, AdminProduct } from "@/types/admin";

interface ProductFormState {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  discountedPrice: string;
  sku: string;
  stockQuantity: string;
  unit: string;
  origin: string;
  categoryId: string;
  imageUrl: string;
  imageAlt: string;
  isFeatured: boolean;
  isActive: boolean;
}

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  discountedPrice: "",
  sku: "",
  stockQuantity: "",
  unit: "kg",
  origin: "",
  categoryId: "",
  imageUrl: "",
  imageAlt: "",
  isFeatured: false,
  isActive: true,
};

const mapProductToForm = (product: AdminProduct): ProductFormState => {
  const primaryImage = getPrimaryProductImage(product);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    price: String(product.price),
    discountedPrice: product.discountedPrice ? String(product.discountedPrice) : "",
    sku: product.sku ?? "",
    stockQuantity: String(product.stockQuantity),
    unit: product.unit,
    origin: product.origin ?? "",
    categoryId: product.categoryId ?? "",
    imageUrl: primaryImage?.imageUrl ?? "",
    imageAlt: primaryImage?.altText ?? "",
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };
};

export function AdminProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [productData, categoryData] = await Promise.all([
        adminRequest<AdminProduct[]>("/api/admin/backend/products"),
        adminRequest<AdminCategory[]>("/api/admin/backend/categories"),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load products.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => setForm(emptyForm);

  const submitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!form.name.trim() || !form.slug.trim()) {
      setFeedback({ tone: "error", message: "Name and slug are required." });
      return;
    }

    if (!form.price || Number(form.price) < 0 || Number(form.stockQuantity) < 0) {
      setFeedback({
        tone: "error",
        message: "Price and stock quantity must be zero or greater.",
      });
      return;
    }

    if (form.imageUrl.trim() && !isValidUrl(form.imageUrl.trim())) {
      setFeedback({ tone: "error", message: "Image URL must be a valid URL." });
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      description: form.description.trim() || undefined,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      sku: form.sku.trim() || undefined,
      stockQuantity: Number(form.stockQuantity),
      unit: form.unit.trim() || "kg",
      origin: form.origin.trim() || undefined,
      categoryId: form.categoryId || undefined,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      images: form.imageUrl.trim()
        ? [
            {
              imageUrl: form.imageUrl.trim(),
              altText: form.imageAlt.trim() || undefined,
              isPrimary: true,
              sortOrder: 0,
            },
          ]
        : [],
    };

    startTransition(async () => {
      try {
        if (form.id) {
          await adminRequest(`/api/admin/backend/products/${form.id}`, {
            method: "PATCH",
            body: payload,
          });
        } else {
          await adminRequest("/api/admin/backend/products", {
            method: "POST",
            body: payload,
          });
        }

        setFeedback({
          tone: "success",
          message: form.id ? "Product updated successfully." : "Product created successfully.",
        });
        resetForm();
        await loadData();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not save product.",
        });
      }
    });
  };

  const handleDelete = (product: AdminProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`/api/admin/backend/products/${product.id}`, {
          method: "DELETE",
        });
        setFeedback({ tone: "success", message: "Product deleted successfully." });
        if (form.id === product.id) {
          resetForm();
        }
        await loadData();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not delete product.",
        });
      }
    });
  };

  const toggleFlag = (product: AdminProduct, key: "isFeatured" | "isActive") => {
    startTransition(async () => {
      try {
        await adminRequest(`/api/admin/backend/products/${product.id}`, {
          method: "PATCH",
          body: {
            [key]: !product[key],
          },
        });

        setFeedback({
          tone: "success",
          message: key === "isFeatured" ? "Featured state updated." : "Published state updated.",
        });
        await loadData();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not update product.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Products"
        title="Catalog management"
        description="Create, edit, publish, and feature products using the existing backend product module."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-brand-deep">
              {form.id ? "Edit product" : "Create product"}
            </h2>
            {form.id ? (
              <button type="button" className="text-sm font-semibold text-accent" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <form onSubmit={submitProduct} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Name</span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                      slug: current.id ? current.slug : slugify(event.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, slug: slugify(event.target.value) }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Short description</span>
              <input
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shortDescription: event.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Description</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Discounted price</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discountedPrice}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, discountedPrice: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Stock quantity</span>
                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stockQuantity: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Unit</span>
                <input
                  value={form.unit}
                  onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Category</span>
                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, categoryId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Origin</span>
                <input
                  value={form.origin}
                  onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">SKU</span>
                <input
                  value={form.sku}
                  onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Image URL</span>
                <input
                  value={form.imageUrl}
                  onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Image alt text</span>
              <input
                value={form.imageAlt}
                onChange={(event) => setForm((current) => ({ ...current, imageAlt: event.target.value }))}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
                />
                Featured product
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                />
                Published
              </label>
            </div>

            <Button type="submit" fullWidth disabled={isPending}>
              {isPending ? "Saving..." : form.id ? "Update product" : "Create product"}
            </Button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <div>
            <h2 className="text-xl font-semibold text-brand-deep">All products</h2>
            <p className="mt-1 text-sm text-muted">{products.length} items in the catalog.</p>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-20 rounded-3xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No products yet"
                description="Create your first product using the form on the left."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const primaryImage = getPrimaryProductImage(product);

                    return (
                      <tr key={product.id} className="border-b border-border/70 align-top last:border-b-0">
                        <td className="py-4">
                          <div className="flex min-w-[220px] items-start gap-3">
                            {primaryImage?.imageUrl ? (
                              <img
                                src={primaryImage.imageUrl}
                                alt={product.name}
                                className="h-14 w-14 rounded-2xl object-cover"
                              />
                            ) : null}
                            <div>
                              <p className="font-semibold text-brand-deep">{product.name}</p>
                              <p className="mt-1 text-xs text-muted">{product.category?.name ?? "Uncategorized"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">{formatCurrency(product.discountedPrice ?? product.price)}</td>
                        <td className="py-4">{product.stockQuantity} {product.unit}</td>
                        <td className="py-4 space-x-2">
                          <AdminStatusBadge tone={product.isActive ? "success" : "danger"}>
                            {product.isActive ? "published" : "draft"}
                          </AdminStatusBadge>
                          {product.isFeatured ? <AdminStatusBadge tone="warning">featured</AdminStatusBadge> : null}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                              onClick={() => setForm(mapProductToForm(product))}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                              onClick={() => toggleFlag(product, "isFeatured")}
                            >
                              {product.isFeatured ? "Unfeature" : "Feature"}
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                              onClick={() => toggleFlag(product, "isActive")}
                            >
                              {product.isActive ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                              onClick={() => handleDelete(product)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
