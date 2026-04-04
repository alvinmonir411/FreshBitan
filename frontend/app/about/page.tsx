import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getSiteContent,
  seasonalAvailabilityItems,
  whyChooseItems,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how FreshBitan sources and delivers premium mangoes and seasonal fruits across Bangladesh.",
};

export default async function AboutPage() {
  const siteContent = await getSiteContent();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow="About FreshBitan"
          title="A fruit brand built around freshness, trust, and simple ordering"
          description={siteContent.aboutSummary}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.7rem] border border-border bg-white/80 p-6">
            <h2 className="text-xl font-semibold text-brand-deep">Our approach</h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              FreshBitan is designed for customers who want premium mangoes and
              seasonal fruits without guesswork. We keep the customer journey
              simple, mobile-friendly, and Bangla-friendly from the first click
              to the final delivery update.
            </p>
          </article>
          <article className="rounded-[1.7rem] border border-border bg-white/80 p-6">
            <h2 className="text-xl font-semibold text-brand-deep">Our promise</h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              {siteContent.deliveryPromise}. We combine careful fruit handling,
              reliable packaging, and WhatsApp-first support so customers can
              order with more confidence.
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {whyChooseItems.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-border bg-card p-6"
          >
            <h3 className="text-xl font-semibold text-brand-deep">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow="Season Window"
          title="How the mango calendar shapes the FreshBitan experience"
          description="Different varieties arrive at different times, so we plan updates and communication around the real orchard season."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {seasonalAvailabilityItems.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-border bg-white/80 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {item.months}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-brand-deep">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
