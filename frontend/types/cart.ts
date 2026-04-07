import { ProductOption, ProductSummary } from "@/types/api";

export interface CartItem {
  productId: string;
  productOptionId: string;
  slug: string;
  name: string;
  optionLabel: string;
  unitPrice: number;
  stockQuantity: number;
  quantity: number;
  imageUrl: string | null;
  imageAlt: string | null;
  categoryName: string | null;
}

export type CartProductInput = Pick<
  ProductSummary,
  | "id"
  | "slug"
  | "name"
  | "images"
  | "options"
  | "category"
>;

export type CartProductOptionInput = Pick<
  ProductOption,
  | "id"
  | "label"
  | "price"
  | "discountedPrice"
  | "stockQuantity"
  | "isActive"
>;

export type CheckoutPaymentMethod = "cash_on_delivery" | "bkash" | "nagad";

export interface CheckoutFormValues {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  district: string;
  notes: string;
  paymentMethod: CheckoutPaymentMethod;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (
    product: CartProductInput,
    option: CartProductOptionInput,
    quantity?: number,
  ) => void;
  updateQuantity: (
    productId: string,
    productOptionId: string,
    quantity: number,
  ) => void;
  removeItem: (productId: string, productOptionId: string) => void;
  clearCart: () => void;
}
