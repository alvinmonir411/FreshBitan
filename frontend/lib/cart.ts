import { CreateOrderPayload, PaymentMethod } from "@/types/api";
import {
  CartItem,
  CheckoutFormValues,
  CheckoutPaymentMethod,
} from "@/types/cart";
import { SiteContent } from "@/types/site";

export const CART_STORAGE_KEY = "freshbitan-cart-v1";

const defaultMaxQuantity = 99;

const checkoutPaymentConfig: Record<
  CheckoutPaymentMethod,
  {
    label: string;
    description: string;
    apiValue: PaymentMethod;
    noteLine?: string;
  }
> = {
  cash_on_delivery: {
    label: "Cash on Delivery",
    description: "পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।",
    apiValue: "cash_on_delivery",
  },
  bkash: {
    label: "bKash",
    description: "অর্ডার কনফার্মের সময় bKash payment নির্দেশনা পাওয়া যাবে।",
    apiValue: "online_payment",
    noteLine: "Preferred payment channel: bKash",
  },
  nagad: {
    label: "Nagad",
    description: "অর্ডার কনফার্মের সময় Nagad payment নির্দেশনা পাওয়া যাবে।",
    apiValue: "bank_transfer",
    noteLine: "Preferred payment channel: Nagad",
  },
};

export const checkoutPaymentOptions = (
  Object.entries(checkoutPaymentConfig) as Array<
    [
      CheckoutPaymentMethod,
      (typeof checkoutPaymentConfig)[CheckoutPaymentMethod],
    ]
  >
).map(([value, config]) => ({
  value,
  ...config,
}));

const getMaxQuantity = (stockQuantity: number) =>
  stockQuantity > 0 ? Math.min(stockQuantity, defaultMaxQuantity) : defaultMaxQuantity;

export const clampCartQuantity = (quantity: number, stockQuantity: number) => {
  const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  return Math.min(Math.max(safeQuantity, 1), getMaxQuantity(stockQuantity));
};

export const getCartItemCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0,
  );

export const getDeliveryCharge = (
  district: string,
  siteContent: Pick<SiteContent, "deliveryChargeDhaka" | "deliveryChargeOutsideDhaka">,
) => {
  const normalizedDistrict = district.trim().toLowerCase();

  if (!normalizedDistrict) {
    return siteContent.deliveryChargeOutsideDhaka;
  }

  return normalizedDistrict.includes("dhaka")
    ? siteContent.deliveryChargeDhaka
    : siteContent.deliveryChargeOutsideDhaka;
};

export const getCheckoutPaymentDetails = (method: CheckoutPaymentMethod) =>
  checkoutPaymentConfig[method];

export const buildOrderPayload = ({
  formValues,
  items,
  siteContent,
}: {
  formValues: CheckoutFormValues;
  items: CartItem[];
  siteContent: Pick<SiteContent, "deliveryChargeDhaka" | "deliveryChargeOutsideDhaka">;
}): CreateOrderPayload => {
  const paymentDetails = getCheckoutPaymentDetails(formValues.paymentMethod);
  const deliveryFee = getDeliveryCharge(formValues.district, siteContent);
  const notes = [
    formValues.notes.trim(),
    paymentDetails.noteLine,
    "Source: storefront cart checkout",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    customerName: formValues.customerName.trim(),
    customerEmail: formValues.email.trim() || undefined,
    customerPhone: formValues.phone.trim(),
    shippingAddress: formValues.address.trim(),
    district: formValues.district.trim() || undefined,
    area: formValues.area.trim() || undefined,
    notes: notes || undefined,
    deliveryFee,
    paymentMethod: paymentDetails.apiValue,
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
};
