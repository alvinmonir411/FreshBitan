import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);

  return buildPublicMetadata({
    title: t.home.metaTitle,
    description: t.home.metaDescription,
    path: "/",
    keywords:
      locale === "en"
        ? [
            "FreshBitan",
            "Bangladesh mango delivery",
            "Rajshahi mango shop",
            "buy mango online",
          ]
        : [
            "ফ্রেশবিটান",
            "বাংলাদেশ আম ডেলিভারি",
            "রাজশাহী আম",
            "অনলাইনে আম কিনুন",
          ],
  });
}

export default function Home() {
  return <HomePage />;
}
