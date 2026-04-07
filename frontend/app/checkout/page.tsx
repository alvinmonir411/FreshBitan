import type { Metadata } from "next";
import { CheckoutPageContent } from "@/components/checkout/checkout-page-content";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  return buildPublicMetadata({
    title: t.checkoutPage.metaTitle,
    description: t.checkoutPage.metaDescription,
    path: "/checkout",
  });
}

export default async function CheckoutPage() {
  const locale = await getSiteLocale();
  const siteContent = await getSiteContent(locale);

  return <CheckoutPageContent siteContent={siteContent} />;
}
