import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { AppShell } from "@/components/layout/app-shell";
import { getSiteContent } from "@/lib/site-content";
import "./globals.css";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "FreshBitan";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${brandName} | সরাসরি বাগান থেকে টাটকা আম`,
    template: `%s | ${brandName}`,
  },
  description:
    "FreshBitan is a Bangladesh mango and seasonal fruit ecommerce brand with fresh orchard-first sourcing, safe delivery, and WhatsApp-friendly ordering.",
  keywords: [
    "FreshBitan",
    "Bangladesh mango ecommerce",
    "seasonal fruit delivery",
    "Rajshahi mango",
    "সরাসরি বাগান থেকে টাটকা আম",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

  return (
    <html
      lang="en-BD"
      className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AppShell siteContent={siteContent}>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
