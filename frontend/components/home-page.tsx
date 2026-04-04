import Link from "next/link";
import { ProductCard } from "@/components/cards/product-card";
import { ReviewCard } from "@/components/cards/review-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProducts, getPublicReviews } from "@/lib/api";
import {
  faqItems,
  getSiteContent,
  seasonalAvailabilityItems,
  whyChooseItems,
} from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";

export async function HomePage() {
  const [siteContent, featuredProducts, allProducts, reviews] = await Promise.all([
    getSiteContent(),
    getPublicProducts({ featured: true }),
    getPublicProducts(),
    getPublicReviews(),
  ]);

  const productsToShow =
    featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : allProducts.slice(0, 3);
  const reviewPreview = reviews.slice(0, 3);

  return (
    <main className="pb-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 sm:px-8 lg:px-10 lg:gap-24 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center animate-fade-in-up">
          <div className="rounded-[2.25rem] border border-white/30 glass-card p-8 premium-shadow sm:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-3xl animate-float" />
            <span className="relative z-10 inline-flex rounded-full border border-brand/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep">
              {siteContent.heroBadge}
            </span>
            <div className="relative z-10 mt-8 max-w-3xl space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                {siteContent.tagline}
              </p>
              <h1 className="font-display text-4xl leading-tight text-brand-deep sm:text-5xl lg:text-6xl">
                {siteContent.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {siteContent.heroDescription}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                আজই অর্ডার করুন
              </Link>
              <a
                href={buildWhatsappLink(
                  siteContent.whatsappNumber,
                  siteContent.whatsappMessage,
                )}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "whatsapp", size: "lg" })}
              >
                WhatsApp-এ কথা বলুন
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "সরাসরি বাগান থেকে টাটকা আম",
                siteContent.deliveryPromise,
                "বিশ্বস্ত মান, নিরাপদ প্যাকেজিং, দ্রুত ডেলিভারি",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-white/40 glass-card p-4 text-sm font-medium text-foreground hover-premium-shadow"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 animate-fade-in-up delay-100">
            <article className="rounded-[2rem] border border-brand/20 bg-[linear-gradient(135deg,#fff2d3,#ffd795)] p-6 premium-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
              <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.24em] text-brand-deep">
                Why FreshBitan
              </p>
              <h2 className="mt-4 font-display text-3xl text-brand-deep">
                Premium fruit feel with a local Bangla-friendly experience
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#73481f]">
                FreshBitan focuses on cleaner sourcing, careful presentation, and
                quick support so visitors can move from browsing to confident ordering.
              </p>
            </article>
            <article className="rounded-[2rem] border border-white/40 glass-card p-6 hover-premium-shadow">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Seasonal availability
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">
                {siteContent.seasonalNote}
              </p>
              <Link
                href="/products?featured=true"
                className={`${buttonVariants({
                  variant: "outline",
                  size: "md",
                })} mt-6`}
              >
                Featured varieties
              </Link>
            </article>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Featured Mango Varieties"
            title="Popular picks from the current FreshBitan collection"
            description="Backend-driven featured products are shown here whenever available, with a graceful fallback to the latest public listings."
          />
          {productsToShow.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {productsToShow.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="নতুন সিজনের পণ্য শিগগিরই আসছে"
              description="Our featured mango list will appear here as soon as the backend product collection is published."
              actionHref="/contact"
              actionLabel="WhatsApp inquiry"
            />
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-3 animate-fade-in-up delay-200">
          {whyChooseItems.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-white/40 glass-card p-6 hover-premium-shadow"
            >
              <h3 className="text-xl font-semibold text-brand-deep">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-[2.2rem] border border-white/40 glass-card p-8 sm:p-10 premium-shadow animate-fade-in-up delay-300">
          <SectionHeading
            eyebrow="Seasonal Availability"
            title="Mango season planning made clear"
            description="FreshBitan keeps the public site ready for variety-wise updates so customers know what to expect through the season."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {seasonalAvailabilityItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-white/30 bg-white/50 p-5 hover-premium-shadow backdrop-blur-sm"
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

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="What customers say after delivery"
            description="Published testimonials are pulled from the backend reviews API and previewed here for social proof."
          />
          {reviewPreview.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {reviewPreview.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Reviews will appear here"
              description="Once approved customer reviews are available, this section will automatically surface them."
              actionHref="/reviews"
              actionLabel="Visit reviews page"
            />
          )}
        </section>

        <section className="grid gap-8 rounded-[2.2rem] border border-white/40 glass-card p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] premium-shadow animate-fade-in-up delay-400">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions before ordering"
            description="A few quick answers to help visitors move from interest to confident action."
          />
          <FaqAccordion items={faqItems} />
        </section>
      </div>
    </main>
  );
}
