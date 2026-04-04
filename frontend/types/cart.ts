import { ProductSummary } from "@/types/api";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  discountedPrice: number | null;
  unit: string;
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
  | "price"
  | "discountedPrice"
  | "unit"
  | "stockQuantity"
  | "images"
  | "category"
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
  addItem: (product: CartProductInput, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}
