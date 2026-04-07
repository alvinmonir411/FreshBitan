import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import { buildPublicMetadata } from "@/lib/metadata";
import {
  getSeasonalAvailabilityItems,
  getSiteContent,
  getWhyChooseItems,
} from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);

  return buildPublicMetadata({
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    path: "/about",
    keywords:
      locale === "en"
        ? ["about FreshBitan", "mango sourcing", "Bangladesh mango delivery"]
        : ["ফ্রেশবিটান সম্পর্কে", "আম সংগ্রহ", "বাংলাদেশ আম ডেলিভারি"],
  });
}

export default async function AboutPage() {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const siteContent = await getSiteContent(locale);
  const whyChooseItems = getWhyChooseItems(locale);
  const seasonalAvailabilityItems = getSeasonalAvailabilityItems(locale);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-[2.2rem] border border-border bg-card p-8 sm:p-10">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          description={siteContent.aboutSummary}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.7rem] border border-border bg-white/80 p-6">
            <h2 className="text-xl font-semibold text-brand-deep">{t.about.approachTitle}</h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              {t.about.approachBody}
            </p>
          </article>
          <article className="rounded-[1.7rem] border border-border bg-white/80 p-6">
            <h2 className="text-xl font-semibold text-brand-deep">{t.about.promiseTitle}</h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              {siteContent.deliveryPromise}. We combine careful mango handling,
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
          eyebrow={t.about.seasonEyebrow}
          title={t.about.seasonTitle}
          description={t.about.seasonDescription}
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
