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
import {
  formatCurrency,
  getActiveProductOptions,
  getCompactOptionLabel,
  getDefaultProductOption,
  getDisplayPrice,
  getPrimaryProductImage,
} from "@/lib/utils";
import { AdminCategory, AdminProduct } from "@/types/admin";

interface ProductOptionFormState {
  label: string;
  price: string;
  discountedPrice: string;
  stockQuantity: string;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

interface ProductImageFormState {
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductFormState {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  origin: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  options: ProductOptionFormState[];
  images: ProductImageFormState[];
}

interface CloudinaryUploadResponse {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  originalFilename?: string;
}

const createEmptyOption = (
  partial?: Partial<ProductOptionFormState>,
): ProductOptionFormState => ({
  label: "",
  price: "",
  discountedPrice: "",
  stockQuantity: "0",
  sortOrder: 0,
  isDefault: false,
  isActive: true,
  ...partial,
});

const createEmptyImage = (
  partial?: Partial<ProductImageFormState>,
): ProductImageFormState => ({
  imageUrl: "",
  altText: "",
  isPrimary: false,
  sortOrder: 0,
  ...partial,
});

const createEmptyForm = (): ProductFormState => ({
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  sku: "",
  origin: "",
  categoryId: "",
  isFeatured: false,
  isActive: true,
  options: [createEmptyOption({ label: "1 kg", isDefault: true })],
  images: [createEmptyImage({ isPrimary: true })],
});

const mapProductToForm = (product: AdminProduct): ProductFormState => {
  const options = product.options.length
    ? product.options
    : [
        {
          id: "legacy",
          productId: product.id,
          label: product.unit,
          price: product.price,
          discountedPrice: product.discountedPrice,
          stockQuantity: product.stockQuantity,
          sortOrder: 0,
          isDefault: true,
          isActive: true,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      ];

  const images = product.images.length
    ? [...product.images]
        .sort((first, second) => first.sortOrder - second.sortOrder)
        .map((image, index) => ({
          imageUrl: image.imageUrl,
          altText: image.altText ?? "",
          isPrimary: image.isPrimary || index === 0,
          sortOrder: image.sortOrder ?? index,
        }))
    : [createEmptyImage({ isPrimary: true })];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    sku: product.sku ?? "",
    origin: product.origin ?? "",
    categoryId: product.categoryId ?? "",
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    options: options.map((option, index) => ({
      label: option.label,
      price: String(option.price),
      discountedPrice:
        option.discountedPrice !== null ? String(option.discountedPrice) : "",
      stockQuantity: String(option.stockQuantity),
      sortOrder: option.sortOrder ?? index,
      isDefault: option.isDefault,
      isActive: option.isActive,
    })),
    images,
  };
};

export function AdminProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

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

  const resetForm = () => setForm(createEmptyForm());

  const updateOption = (
    index: number,
    key: keyof ProductOptionFormState,
    value: string | boolean | number,
  ) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [key]: value } : option,
      ),
    }));
  };

  const setDefaultOption = (index: number) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => ({
        ...option,
        isDefault: optionIndex === index,
      })),
    }));
  };

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [
        ...current.options,
        createEmptyOption({ sortOrder: current.options.length }),
      ],
    }));
  };

  const removeOption = (index: number) => {
    setForm((current) => {
      const nextOptions = current.options.filter((_, optionIndex) => optionIndex !== index);
      const hasDefault = nextOptions.some((option) => option.isDefault && option.isActive);

      return {
        ...current,
        options: nextOptions.map((option, optionIndex) => ({
          ...option,
          sortOrder: optionIndex,
          isDefault: hasDefault ? option.isDefault : optionIndex === 0,
        })),
      };
    });
  };

  const moveOption = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.options.length) {
        return current;
      }

      const nextOptions = [...current.options];
      const [moved] = nextOptions.splice(index, 1);
      nextOptions.splice(nextIndex, 0, moved);

      return {
        ...current,
        options: nextOptions.map((option, optionIndex) => ({
          ...option,
          sortOrder: optionIndex,
        })),
      };
    });
  };

  const updateImage = (
    index: number,
    key: keyof ProductImageFormState,
    value: string | boolean | number,
  ) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [key]: value } : image,
      ),
    }));
  };

  const setPrimaryImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === index,
      })),
    }));
  };

  const addImageField = () => {
    setForm((current) => ({
      ...current,
      images: [
        ...current.images,
        createEmptyImage({ sortOrder: current.images.length }),
      ],
    }));
  };

  const removeImage = (index: number) => {
    setForm((current) => {
      const nextImages = current.images.filter((_, imageIndex) => imageIndex !== index);
      const hasPrimary = nextImages.some((image) => image.isPrimary && image.imageUrl.trim());

      return {
        ...current,
        images:
          nextImages.length > 0
            ? nextImages.map((image, imageIndex) => ({
                ...image,
                sortOrder: imageIndex,
                isPrimary: hasPrimary ? image.isPrimary : imageIndex === 0,
              }))
            : [createEmptyImage({ isPrimary: true })],
      };
    });
  };

  const uploadImage = (index: number, file: File) => {
    setFeedback(null);
    setUploadingImageIndex(index);

    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("file", file);

        const uploaded = await adminRequest<CloudinaryUploadResponse>(
          "/api/admin/uploads/image",
          {
            method: "POST",
            body,
          },
        );

        setForm((current) => ({
          ...current,
          images: current.images.map((image, imageIndex) =>
            imageIndex === index
              ? {
                  ...image,
                  imageUrl: uploaded.url,
                  altText:
                    image.altText ||
                    uploaded.originalFilename?.replace(/[-_]+/g, " ") ||
                    current.name ||
                    "",
                }
              : image,
          ),
        }));

        setFeedback({
          tone: "success",
          message: "Image uploaded to Cloudinary successfully.",
        });
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Image upload failed.",
        });
      } finally {
        setUploadingImageIndex(null);
      }
    });
  };

  const submitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!form.name.trim() || !form.slug.trim()) {
      setFeedback({ tone: "error", message: "Name and slug are required." });
      return;
    }

    if (form.options.length === 0) {
      setFeedback({ tone: "error", message: "Add at least one purchase option." });
      return;
    }

    const normalizedOptions = form.options.map((option, index) => ({
      label: option.label.trim(),
      price: Number(option.price),
      discountedPrice: option.discountedPrice ? Number(option.discountedPrice) : undefined,
      stockQuantity: Number(option.stockQuantity),
      sortOrder: index,
      isDefault: option.isDefault,
      isActive: option.isActive,
    }));

    if (normalizedOptions.some((option) => !option.label)) {
      setFeedback({ tone: "error", message: "Each option needs a label." });
      return;
    }

    if (
      normalizedOptions.some(
        (option) =>
          !Number.isFinite(option.price) ||
          option.price < 0 ||
          !Number.isFinite(option.stockQuantity) ||
          option.stockQuantity < 0,
      )
    ) {
      setFeedback({
        tone: "error",
        message: "Option price and stock must be zero or greater.",
      });
      return;
    }

    if (!normalizedOptions.some((option) => option.isActive)) {
      setFeedback({
        tone: "error",
        message: "At least one purchase option must stay active.",
      });
      return;
    }

    const defaultOption =
      normalizedOptions.find((option) => option.isDefault && option.isActive) ??
      normalizedOptions.find((option) => option.isActive);

    if (!defaultOption) {
      setFeedback({ tone: "error", message: "Choose one active default option." });
      return;
    }

    const populatedImages = form.images
      .map((image, index) => ({
        imageUrl: image.imageUrl.trim(),
        altText: image.altText.trim(),
        isPrimary: image.isPrimary,
        sortOrder: index,
      }))
      .filter((image) => image.imageUrl);

    if (populatedImages.some((image) => !isValidUrl(image.imageUrl))) {
      setFeedback({
        tone: "error",
        message: "Every image must have a valid URL after upload.",
      });
      return;
    }

    const images = populatedImages.map((image, index) => ({
      imageUrl: image.imageUrl,
      altText: image.altText || undefined,
      isPrimary:
        populatedImages.some((candidate) => candidate.isPrimary) ? image.isPrimary : index === 0,
      sortOrder: index,
    }));

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      description: form.description.trim() || undefined,
      sku: form.sku.trim() || undefined,
      origin: form.origin.trim() || undefined,
      categoryId: form.categoryId || undefined,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      price: defaultOption.price,
      discountedPrice: defaultOption.discountedPrice,
      stockQuantity: normalizedOptions.reduce(
        (sum, option) => sum + (option.isActive ? option.stockQuantity : 0),
        0,
      ),
      unit: getCompactOptionLabel(defaultOption.label),
      images,
      options: normalizedOptions,
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
          body: { [key]: !product[key] },
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
        eyebrow="Mango Products"
        title="Mango catalog management"
        description="Create products, add all pack options, upload multiple images to Cloudinary, and control what customers see."
      />

      {feedback ? <AdminFeedback tone={feedback.tone} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[620px_minmax(0,1fr)]">
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

          <form onSubmit={submitProduct} className="mt-6 space-y-5">
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
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-brand-deep">Origin</span>
                <input
                  value={form.origin}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, origin: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                  placeholder="Rajshahi / Chapainawabganj"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-brand-deep">SKU</span>
              <input
                value={form.sku}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sku: event.target.value }))
                }
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <section className="rounded-[1.6rem] border border-border bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-brand-deep">Product images</h3>
                  <p className="mt-1 text-sm text-muted">
                    Upload to Cloudinary from the dashboard or paste a hosted image URL manually.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                  Add image
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                {form.images.map((image, index) => (
                  <div
                    key={`${image.imageUrl}-${index}`}
                    className="rounded-[1.4rem] border border-border bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-brand-deep">Image {index + 1}</p>
                      <button
                        type="button"
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700"
                        onClick={() => removeImage(index)}
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                      <div className="overflow-hidden rounded-[1.2rem] border border-border bg-[#faf7ef]">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.altText || `Product image ${index + 1}`}
                            className="aspect-square h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square items-center justify-center px-3 text-center text-xs text-muted">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="space-y-2">
                            <span className="text-sm font-semibold text-brand-deep">Upload file</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  uploadImage(index, file);
                                }
                                event.currentTarget.value = "";
                              }}
                              className="block w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-3 file:py-2 file:text-white"
                            />
                          </label>
                          <label className="space-y-2">
                            <span className="text-sm font-semibold text-brand-deep">Image URL</span>
                            <input
                              value={image.imageUrl}
                              onChange={(event) => updateImage(index, "imageUrl", event.target.value)}
                              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                              placeholder="https://..."
                            />
                          </label>
                        </div>

                        <label className="space-y-2">
                          <span className="text-sm font-semibold text-brand-deep">Image alt text</span>
                          <input
                            value={image.altText}
                            onChange={(event) => updateImage(index, "altText", event.target.value)}
                            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                          />
                        </label>

                        <div className="flex flex-wrap items-center gap-3">
                          <label className="flex items-center gap-3 rounded-2xl border border-border bg-[#f7fbf2] px-4 py-3 text-sm font-semibold text-brand-deep">
                            <input
                              type="radio"
                              checked={image.isPrimary}
                              onChange={() => setPrimaryImage(index)}
                            />
                            Primary image
                          </label>
                          {uploadingImageIndex === index ? (
                            <span className="text-sm font-semibold text-accent">Uploading...</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-border bg-white/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-brand-deep">Purchase options</h3>
                  <p className="mt-1 text-sm text-muted">
                    Add all pack sizes, estimated box details, custom labels, prices, discounts, and stock.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  Add option
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                {form.options.map((option, index) => (
                  <div key={`${option.label}-${index}`} className="rounded-[1.4rem] border border-border bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-brand-deep">Option {index + 1}</p>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-brand-deep" onClick={() => moveOption(index, -1)} disabled={index === 0}>Up</button>
                        <button type="button" className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-brand-deep" onClick={() => moveOption(index, 1)} disabled={index === form.options.length - 1}>Down</button>
                        <button type="button" className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700" onClick={() => removeOption(index)} disabled={form.options.length === 1}>Delete</button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-brand-deep">Label</span>
                        <input
                          value={option.label}
                          onChange={(event) => updateOption(index, "label", event.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                          placeholder="1 kg / 1 box | est. 4-5 kg | approx. 12-16 pcs"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-brand-deep">Price</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={option.price}
                          onChange={(event) => updateOption(index, "price", event.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-brand-deep">Discounted price</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={option.discountedPrice}
                          onChange={(event) => updateOption(index, "discountedPrice", event.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-brand-deep">Stock quantity</span>
                        <input
                          type="number"
                          min="0"
                          value={option.stockQuantity}
                          onChange={(event) => updateOption(index, "stockQuantity", event.target.value)}
                          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                        />
                      </label>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-2xl border border-border bg-[#f7fbf2] px-4 py-3 text-sm font-semibold text-brand-deep">
                        <input type="radio" checked={option.isDefault} onChange={() => setDefaultOption(index)} />
                        Default option
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
                        <input type="checkbox" checked={option.isActive} onChange={(event) => updateOption(index, "isActive", event.target.checked)} />
                        Active for customers
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
                <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                Featured product
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-brand-deep">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                Published
              </label>
            </div>

            <Button type="submit" fullWidth disabled={isPending || uploadingImageIndex !== null}>
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
              <EmptyState title="No products yet" description="Create your first product using the form on the left." />
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Starting price</th>
                    <th className="pb-3 font-semibold">Options</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const primaryImage = getPrimaryProductImage(product);
                    const activeOptions = getActiveProductOptions(product);
                    const defaultOption = getDefaultProductOption(product);

                    return (
                      <tr key={product.id} className="border-b border-border/70 align-top last:border-b-0">
                        <td className="py-4">
                          <div className="flex min-w-[240px] items-start gap-3">
                            {primaryImage?.imageUrl ? <img src={primaryImage.imageUrl} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" /> : null}
                            <div>
                              <p className="font-semibold text-brand-deep">{product.name}</p>
                              <p className="mt-1 text-xs text-muted">{product.category?.name ?? "Uncategorized"}</p>
                              <p className="mt-1 text-xs text-muted">{product.images.length} image(s)</p>
                              {defaultOption ? <p className="mt-1 text-xs text-muted">Default: {defaultOption.label}</p> : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">{formatCurrency(getDisplayPrice(product))}</td>
                        <td className="py-4">
                          <p>{activeOptions.length} active options</p>
                          <p className="mt-1 text-xs text-muted">{activeOptions.slice(0, 2).map((option) => option.label).join(", ") || "No options"}</p>
                        </td>
                        <td className="py-4 space-x-2">
                          <AdminStatusBadge tone={product.isActive ? "success" : "danger"}>{product.isActive ? "published" : "draft"}</AdminStatusBadge>
                          {product.isFeatured ? <AdminStatusBadge tone="warning">featured</AdminStatusBadge> : null}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep" onClick={() => setForm(mapProductToForm(product))}>Edit</button>
                            <button type="button" className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep" onClick={() => toggleFlag(product, "isFeatured")}>{product.isFeatured ? "Unfeature" : "Feature"}</button>
                            <button type="button" className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-brand-deep" onClick={() => toggleFlag(product, "isActive")}>{product.isActive ? "Unpublish" : "Publish"}</button>
                            <button type="button" className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700" onClick={() => handleDelete(product)}>Delete</button>
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
