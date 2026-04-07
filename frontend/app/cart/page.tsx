import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  return buildPublicMetadata({
    title: t.cartPage.metaTitle,
    description: t.cartPage.metaDescription,
    path: "/cart",
  });
}

export default async function CartPage() {
  const locale = await getSiteLocale();
  const siteContent = await getSiteContent(locale);

  return <CartPageContent siteContent={siteContent} />;
}
