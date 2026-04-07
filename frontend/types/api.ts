export interface HealthResponse {
  status: "ok";
  service: string;
  timestamp: string;
}

export interface ApiEntityBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSetting extends ApiEntityBase {
  key: string;
  value: string | null;
  type: string;
  label: string | null;
  description: string | null;
  isPublic: boolean;
}

export interface Category extends ApiEntityBase {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductImage extends ApiEntityBase {
  productId: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductOption extends ApiEntityBase {
  productId: string;
  label: string;
  price: number;
  discountedPrice: number | null;
  stockQuantity: number;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface ProductSummary extends ApiEntityBase {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  discountedPrice: number | null;
  sku: string | null;
  stockQuantity: number;
  unit: string;
  origin: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string | null;
  category: Category | null;
  images: ProductImage[];
  options: ProductOption[];
}

export interface Review extends ApiEntityBase {
  productId: string;
  customerName: string;
  customerEmail: string | null;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  product?: ProductSummary | null;
}

export interface Product extends ProductSummary {
  reviews: Review[];
}

export type PaymentMethod =
  | "cash_on_delivery"
  | "bkash"
  | "nagad";

export interface CreateReviewPayload {
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment?: string;
}

export interface CreateOrderItemPayload {
  productId: string;
  productOptionId?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  district?: string;
  area?: string;
  notes?: string;
  deliveryFee?: number;
  paymentMethod?: PaymentMethod;
  items: CreateOrderItemPayload[];
}

export interface OrderItem extends ApiEntityBase {
  orderId: string;
  productId: string;
  productOptionId: string | null;
  productName: string;
  optionLabel: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  product?: ProductSummary;
  productOption?: ProductOption | null;
}

export interface Order extends ApiEntityBase {
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: string;
  district: string | null;
  area: string | null;
  notes: string | null;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  items: OrderItem[];
}
