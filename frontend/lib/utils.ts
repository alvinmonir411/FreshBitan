import { Product, ProductImage } from "@/types/api";

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

export const getDisplayPrice = (product: Pick<Product, "price" | "discountedPrice">) =>
  product.discountedPrice ?? product.price;
