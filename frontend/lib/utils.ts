import { Product, ProductImage, ProductOption } from "@/types/api";

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export const normalizePhoneNumber = (value: string) =>
  value.replace(/[^\d]/g, "");

export const buildWhatsappLink = (phoneNumber: string, message: string) =>
  `https://wa.me/${normalizePhoneNumber(phoneNumber)}?text=${encodeURIComponent(message)}`;

export const getPrimaryProductImage = (
  product: Pick<Product, "images"> | ProductImage[],
) => {
  const images = Array.isArray(product) ? product : product.images;

  if (!images || images.length === 0) {
    return null;
  }

  return images.find((image) => image.isPrimary) ?? images[0];
};

export const getActiveProductOptions = (
  product: Pick<Product, "options"> | { options?: ProductOption[] | null },
) =>
  [...(product.options ?? [])]
    .filter((option) => option.isActive)
    .sort((first, second) => first.sortOrder - second.sortOrder);

export const getDefaultProductOption = (
  product: Pick<Product, "options"> | { options?: ProductOption[] | null },
) => {
  const activeOptions = getActiveProductOptions(product);

  return (
    activeOptions.find((option) => option.isDefault) ??
    activeOptions[0] ??
    null
  );
};

export const getDisplayPrice = (
  product:
    | Pick<Product, "price" | "discountedPrice">
    | (Pick<Product, "options" | "price" | "discountedPrice"> & {
        options?: ProductOption[] | null;
      }),
) => {
  if ("options" in product && Array.isArray(product.options)) {
    const defaultOption = getDefaultProductOption(product);

    if (defaultOption) {
      return defaultOption.discountedPrice ?? defaultOption.price;
    }
  }

  return product.discountedPrice ?? product.price;
};

export const getCompareAtPrice = (
  option: Pick<ProductOption, "price" | "discountedPrice">,
) => (option.discountedPrice ? option.price : null);

export const getCompactOptionLabel = (label: string) =>
  label.split("|")[0]?.trim() || label;

export const getExpandedOptionDetails = (label: string) => {
  if (label.includes("|")) {
    return label;
  }

  const normalized = label.trim().toLowerCase();

  const labelMap: Record<string, string> = {
    "1 box": "1 box | est. 4-5 kg | approx. 12-16 pcs",
    "2 boxes": "2 boxes | est. 8-10 kg | approx. 24-32 pcs",
    "1 basket": "1 basket | est. 6-7 kg | approx. 18-22 pcs",
    "2 baskets": "2 baskets | est. 12-14 kg | approx. 36-44 pcs",
    "1 crate": "1 crate | est. 8-10 kg | assorted fruits",
    "2 crates": "2 crates | est. 16-20 kg | assorted fruits",
    "1 dozen": "1 dozen | 12 pcs | est. 1.4-1.8 kg",
    "2 dozens": "2 dozens | 24 pcs | est. 2.8-3.6 kg",
  };

  return labelMap[normalized] ?? label;
};
