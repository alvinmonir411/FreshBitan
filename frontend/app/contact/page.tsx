import type { Metadata } from "next";
import { QuickOrderForm } from "@/components/forms/quick-order-form";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { contactHighlights, getSiteContent } from "@/lib/site-content";
import { getPublicProducts } from "@/lib/api";
import { buildWhatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact FreshBitan, start a WhatsApp lead, or place a quick public order through the website.",
};

interface ContactPageProps {
  searchParams: Promise<{
    productId?: string;
  }>;
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const [siteContent, products] = await Promise.all([
    getSiteContent(),
    getPublicProducts(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow="Contact FreshBitan"
          title="Turn interest into a confirmed order or WhatsApp lead"
          description="Use the quick order form below, or reach out through WhatsApp and Facebook for product availability, delivery timing, or gifting support."
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
            WhatsApp Lead
          </a>
          <a
            href={siteContent.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Facebook Page
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
            eyebrow="Quick Order"
            title="Place a direct order without a cart"
            description="This simple form posts to the backend public orders API and can redirect customers straight to an order success page."
          />
          <div className="rounded-[1.7rem] border border-border bg-white/80 p-6 text-sm leading-8 text-muted">
            <p>
              <span className="font-semibold text-brand-deep">Phone:</span>{" "}
              {siteContent.phone}
            </p>
            <p>
              <span className="font-semibold text-brand-deep">Email:</span>{" "}
              {siteContent.email}
            </p>
            <p>
              <span className="font-semibold text-brand-deep">Address:</span>{" "}
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
            title="No orderable products published yet"
            description="Publish at least one product in the backend to enable the quick order form."
            actionHref="/products"
            actionLabel="Browse products"
          />
        )}
      </section>
    </main>
  );
}
