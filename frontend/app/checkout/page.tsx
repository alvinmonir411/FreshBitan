import type { Metadata } from "next";
import { CheckoutPageContent } from "@/components/checkout/checkout-page-content";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your FreshBitan order with delivery details and a mobile-friendly checkout form.",
};

export default async function CheckoutPage() {
  const siteContent = await getSiteContent();

  return <CheckoutPageContent siteContent={siteContent} />;
}
