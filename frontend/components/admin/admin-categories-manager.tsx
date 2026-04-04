"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { AdminFeedback } from "@/components/admin/admin-feedback";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { adminRequest, isValidUrl, slugify } from "@/lib/admin-client";
import { AdminCategory } from "@/types/admin";

interface CategoryFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: string;
  isActive: boolean;
}

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  sortOrder: "0",
  isActive: true,
};

const mapCategoryToForm = (category: AdminCategory): CategoryFormState => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description ?? "",
  imageUrl: category.imageUrl ?? "",
  sortOrder: String(category.sortOrder),
  isActive: category.isActive,
});

export function AdminCategoriesManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadCategories = async () => {
    setIsLoading(true);

    try {
      const data = await adminRequest<AdminCategory[]>("/api/admin/backend/categories");
      setCategories(data);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load categories.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!form.name.trim() || !form.slug.trim()) {
      setFeedback({ tone: "error", message: "Name and slug are required." });
      return;
    }

    if (form.imageUrl.trim() && !isValidUrl(form.imageUrl.trim())) {
      setFeedback({ tone: "error", message: "Image URL must be valid." });
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(
          form.id ? `/api/admin/backend/categories/${form.id}` : "/api/admin/backend/categories",
          {
            method: form.id ? "PATCH" : "POST",
            body: {
              name: form.name.trim(),
              slug: form.slug.trim(),
              description: form.description.trim() || undefined,
              imageUrl: form.imageUrl.trim() || undefined,
              sortOrder: Number(form.sortOrder) || 0,
              isActive: form.isActive,
            },
          },
        );

        setFeedback({
          tone: "success",
          message: form.id ? "Category updated successfully." : "Category created successfully.",
        });
        resetForm();
        await loadCategories();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not save category.",
        });
      }
    });
  };

  const handleDelete = (category: AdminCategory) => {
    if (!window.confirm(`Delete "${category.name}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await adminRequest(`/api/admin/backend/categories/${category.id}`, {
          method: "DELETE",
        });
        setFeedback({ tone: "success", message: "Category deleted successfully." });
        if (form.id === category.id) {
          resetForm();
        }
        await loadCategories();
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Could not delete category.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Categories"
        title="Category structure"
        description="Keep category organization simple, published, and aligned with the public storefront."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-brand-deep">
              {form.id ? "Edit category" : "Create category"}
            </h2>
            {form.id ? (
              <button type="button" className="text-sm font-semibold text-accent" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, imageUrl: event.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">Sort order</span>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sortOrder: event.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, isActive: event.target.checked }))
                }
              />
              Published
            </label>

            <Button type="submit" fullWidth disabled={isPending}>
              {isPending ? "Saving..." : form.id ? "Update category" : "Create category"}
            </Button>
          </form>
        </section>

        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_50px_rgba(142,79,18,0.08)]">
          <h2 className="text-xl font-semibold text-brand-deep">All categories</h2>

          {isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-20 rounded-3xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No categories yet"
                description="Create categories here to organize your product catalog."
              />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Sort</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-border/70 last:border-b-0">
                      <td className="py-4">
                        <p className="font-semibold text-brand-deep">{category.name}</p>
                        <p className="mt-1 text-xs text-muted">{category.slug}</p>
                      </td>
                      <td className="py-4">{category.sortOrder}</td>
                      <td className="py-4">
                        <AdminStatusBadge tone={category.isActive ? "success" : "danger"}>
                          {category.isActive ? "published" : "draft"}
                        </AdminStatusBadge>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep"
                            onClick={() => setForm(mapCategoryToForm(category))}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                            onClick={() => handleDelete(category)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
