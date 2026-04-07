import type { Metadata } from "next";
import { QuickOrderForm } from "@/components/forms/quick-order-form";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import { getContactHighlights, getSiteContent } from "@/lib/site-content";
import { getPublicProducts } from "@/lib/api";
import { buildWhatsappLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  return buildPublicMetadata({
    title: t.contactPage.metaTitle,
    description: t.contactPage.metaDescription,
    path: "/contact",
    keywords:
      locale === "en"
        ? ["FreshBitan contact", "mango support", "WhatsApp mango order"]
        : ["ফ্রেশবিটান যোগাযোগ", "আম সাপোর্ট", "হোয়াটসঅ্যাপ আম অর্ডার"],
  });
}

interface ContactPageProps {
  searchParams: Promise<{
    productId?: string;
  }>;
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const resolvedSearchParams = await searchParams;
  const contactHighlights = getContactHighlights(locale);
  const [siteContent, products] = await Promise.all([
    getSiteContent(locale),
    getPublicProducts(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow={t.contactPage.heroEyebrow}
          title={t.contactPage.heroTitle}
          description={t.contactPage.heroDescription}
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildWhatsappLink(
              siteContent.whatsappNumber,
              siteContent.whatsappMessage,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "whatsapp", size: "lg" })}
          >
            {t.contactPage.whatsappLead}
          </a>
          <a
            href={siteContent.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {t.contactPage.facebookPage}
          </a>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {contactHighlights.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-border bg-card p-6"
          >
            <h2 className="text-xl font-semibold text-brand-deep">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 rounded-[2.2rem] border border-border bg-card p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow={t.contactPage.quickOrderEyebrow}
            title={t.contactPage.quickOrderTitle}
            description={t.contactPage.quickOrderDescription}
          />
          <div className="rounded-[1.7rem] border border-border bg-white/80 p-6 text-sm leading-8 text-muted">
            <p>
              <span className="font-semibold text-brand-deep">{t.contactPage.phoneLabel}:</span>{" "}
              {siteContent.phone}
            </p>
            <p>
              <span className="font-semibold text-brand-deep">{t.contactPage.emailLabel}:</span>{" "}
              {siteContent.email}
            </p>
            <p>
              <span className="font-semibold text-brand-deep">{t.contactPage.addressLabel}:</span>{" "}
              {siteContent.address}
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <QuickOrderForm
            products={products}
            siteContent={siteContent}
            initialProductId={resolvedSearchParams.productId}
          />
        ) : (
          <EmptyState
            title={t.contactPage.noProductsTitle}
            description={t.contactPage.noProductsDescription}
            actionHref="/products"
            actionLabel={t.contactPage.noProductsAction}
          />
        )}
      </section>
    </main>
  );
}
