import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { AppShell } from "@/components/layout/app-shell";
import { publicEnv } from "@/lib/env";
import { localeSeo } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { siteMetadataBase } from "@/lib/metadata";
import { getSiteContent } from "@/lib/site-content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const siteContent = await getSiteContent(locale);
  const seo = localeSeo[locale];

  return {
    metadataBase: siteMetadataBase,
    title: {
      default: seo.brandTitle,
      template: `%s | ${siteContent.brandName}`,
    },
    description: seo.brandDescription,
    keywords: [...seo.keywords],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: locale === "bn" ? "bn_BD" : "en_US",
      url: publicEnv.siteUrl,
      title: seo.brandTitle,
      description: seo.brandDescription,
      siteName: siteContent.brandName,
      images: [
        {
          url: "/og-default.svg",
          alt: siteContent.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.brandTitle,
      description: seo.brandDescription,
      images: ["/og-default.svg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getSiteLocale();
  const siteContent = await getSiteContent(locale);

  return (
    <html
      lang={locale === "bn" ? "bn-BD" : "en"}
      className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AppShell siteContent={siteContent} locale={locale}>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
