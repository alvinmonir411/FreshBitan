import Link from "next/link";
import { HomeProductSlider } from "@/components/home-product-slider";
import { ReviewCard } from "@/components/cards/review-card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProducts, getPublicReviews } from "@/lib/api";
import { getDictionary } from "@/lib/locale-data";
import { getSiteLocale } from "@/lib/locale-server";
import {
  getFaqItems,
  getSeasonalAvailabilityItems,
  getSiteContent,
  getWhyChooseItems,
} from "@/lib/site-content";
import { buildWhatsappLink } from "@/lib/utils";
import { ProductSummary } from "@/types/api";

export async function HomePage() {
  const locale = await getSiteLocale();
  const t = getDictionary(locale);
  const [siteContent, featuredProducts, allProducts, reviews] = await Promise.all([
    getSiteContent(locale),
    getPublicProducts({ featured: true }),
    getPublicProducts(),
    getPublicReviews(),
  ]);

  const testimonials = reviews.slice(0, 3);
  const whyChooseItems = getWhyChooseItems(locale);
  const seasonalAvailabilityItems = getSeasonalAvailabilityItems(locale);
  const faqItems = getFaqItems(locale);
  const availableProducts = allProducts.filter((product) => product.isActive);

  const takeUniqueProducts = (
    products: ProductSummary[],
    count: number,
    excludedSlugs = new Set<string>(),
  ) => {
    const selected: ProductSummary[] = [];

    for (const product of products) {
      if (excludedSlugs.has(product.slug)) {
        continue;
      }

      selected.push(product);
      excludedSlugs.add(product.slug);

      if (selected.length === count) {
        break;
      }
    }

    return selected;
  };

  const showcaseUsedSlugs = new Set<string>();
  const bestSellerProducts = takeUniqueProducts(
    featuredProducts.length > 0 ? featuredProducts : availableProducts,
    4,
    showcaseUsedSlugs,
  );
  const premiumMangoProducts = takeUniqueProducts(
    availableProducts.filter((product) =>
      ["rajshahi-mangoes", "premium-seasonal-mangoes"].includes(
        product.category?.slug ?? "",
      ),
    ),
    4,
    showcaseUsedSlugs,
  );
  const giftPackProducts = takeUniqueProducts(
    availableProducts.filter((product) =>
      ["mango-gift-packs", "family-value-packs"].includes(
        product.category?.slug ?? "",
      ),
    ),
    4,
    showcaseUsedSlugs,
  );
  const freshBoxProducts = takeUniqueProducts(
    availableProducts.filter((product) =>
      [
        "mixed-fruit-boxes",
        "organic-citrus",
        "banana-and-tropical-picks",
      ].includes(product.category?.slug ?? ""),
    ),
    4,
    showcaseUsedSlugs,
  );

  const productShowcaseSections =
    locale === "en"
      ? [
          {
            eyebrow: "Best Sellers",
            title: "Most-loved picks customers order first",
            description:
              "Featured customer favorites that work especially well for gifting, family orders, and repeat seasonal buying.",
            products: bestSellerProducts,
          },
          {
            eyebrow: "Premium Mangoes",
            title: "Curated mangoes for premium taste and aroma",
            description:
              "A refined mango collection focused on signature varieties, trusted sourcing, and premium seasonal quality.",
            products: premiumMangoProducts,
          },
          {
            eyebrow: "Gift And Family Packs",
            title: "Larger packs for homes, offices, and gifting",
            description:
              "Thoughtful pack formats for shared tables, client gifts, and household orders that need a little more volume.",
            products: giftPackProducts,
          },
          {
            eyebrow: "Fresh Fruit Boxes",
            title: "Mixed fruit and daily fresh picks",
            description:
              "Beyond mango season, buyers can also explore mixed boxes, citrus, and practical tropical fruit essentials.",
            products: freshBoxProducts,
          },
        ]
      : [
          {
            eyebrow: "Best Seller",
            title: "গ্রাহকের সবচেয়ে পছন্দের অর্ডারগুলো",
            description:
              "গিফট, পরিবারের অর্ডার, আর repeat seasonal buying-এর জন্য সবচেয়ে বেশি পছন্দ হওয়া featured পণ্যগুলো এখানে রাখা হয়েছে।",
            products: bestSellerProducts,
          },
          {
            eyebrow: "Premium Mangoes",
            title: "স্বাদ, ঘ্রাণ, আর quality-তে সেরা প্রিমিয়াম আম",
            description:
              "Signature variety, trusted sourcing, আর premium seasonal quality মাথায় রেখে সাজানো refined mango collection।",
            products: premiumMangoProducts,
          },
          {
            eyebrow: "Gift And Family Packs",
            title: "পরিবার, অফিস, আর gifting-এর জন্য বড় প্যাক",
            description:
              "Shared table, client gift, আর household order-এর জন্য একটু বেশি volume-সহ thoughtful pack format।",
            products: giftPackProducts,
          },
          {
            eyebrow: "Fresh Fruit Boxes",
            title: "মিশ্র ফলের বক্স আর প্রতিদিনের fresh picks",
            description:
              "Mango season ছাড়াও mixed fruit box, citrus, আর everyday tropical fruit-এর practical collection রাখা হয়েছে।",
            products: freshBoxProducts,
          },
        ];

  const orchardSteps =
    locale === "en"
      ? [
          {
            title: "Selected orchard sourcing",
            description: "We focus on trusted mango-growing regions and shortlist lots before dispatch planning begins.",
          },
          {
            title: "Sorting by maturity and quality",
            description: "Mangoes are checked for freshness, pack fit, and presentation before packing decisions are made.",
          },
          {
            title: "Careful pack preparation",
            description: "Weight options, family packs, and gift-ready boxes are arranged with practical packaging in mind.",
          },
          {
            title: "Home delivery support",
            description: "Customers confirm orders through a simple flow and receive delivery support suited to Bangladesh logistics.",
          },
        ]
      : [
          {
            title: "বাছাই করা বাগান থেকে সংগ্রহ",
            description: "বিশ্বস্ত আম উৎপাদন অঞ্চল থেকে lot বাছাই করে তারপর dispatch planning শুরু করা হয়।",
          },
          {
            title: "মান ও maturity অনুযায়ী sorting",
            description: "Freshness, pack fit, আর presentation দেখে আম আলাদা করা হয় যাতে অর্ডারটি বেশি নির্ভরযোগ্য হয়।",
          },
          {
            title: "যত্নে প্যাক প্রস্তুত",
            description: "ওজনভিত্তিক option, family pack, আর gift-ready box practical packaging মাথায় রেখে প্রস্তুত করা হয়।",
          },
          {
            title: "ঘরে পৌঁছে দেওয়ার সহায়তা",
            description: "সহজ order flow-এর মাধ্যমে গ্রাহক order confirm করেন, আর Bangladesh logistics অনুযায়ী delivery support পান।",
          },
        ];

  const trustMetrics =
    locale === "en"
      ? [
          { value: "100%", label: "mango-focused catalog" },
          { value: "12+", label: "district delivery-ready workflow" },
          { value: "3-step", label: "simple manual order confirmation" },
        ]
      : [
          { value: "100%", label: "শুধু আম-কেন্দ্রিক ক্যাটালগ" },
          { value: "12+", label: "ডেলিভারি-ready জেলা workflow" },
          { value: "3-step", label: "সহজ manual order confirmation" },
        ];

  const packagingCards =
    locale === "en"
      ? [
          {
            title: "Family-ready packs",
            description: "Choose from practical pack sizes like 1 kg, 5 kg, 10 kg, or larger household options.",
          },
          {
            title: "Gift-worthy presentation",
            description: "Premium mangoes are packed to feel trustworthy, neat, and appropriate for gifting.",
          },
          {
            title: "Manual support that feels local",
            description: "Cash on Delivery stays simple, and manual bKash or Nagad instruction can be handled later if needed.",
          },
        ]
      : [
          {
            title: "পরিবারের জন্য উপযোগী প্যাক",
            description: "১ কেজি, ৫ কেজি, ১০ কেজি, বা বড় household option থেকে পছন্দমতো বেছে নিন।",
          },
          {
            title: "উপহার দেওয়ার মতো presentation",
            description: "প্রিমিয়াম আম এমনভাবে প্যাক করা হয় যাতে তা পরিষ্কার, বিশ্বস্ত, আর gift-worthy মনে হয়।",
          },
          {
            title: "লোকাল অনুভূতির manual support",
            description: "Cash on Delivery সহজ রাখা হয়েছে, আর দরকার হলে পরে manual bKash বা Nagad instruction দেওয়া যাবে।",
          },
        ];

  const buyingGuides =
    locale === "en"
      ? [
          {
            title: "How to choose the right mango pack size",
            description: "A quick guide for solo buyers, families, and gifting orders.",
          },
          {
            title: "Which mango variety fits your taste",
            description: "Sweetness, aroma, texture, and the best time to order each type.",
          },
          {
            title: "How FreshBitan handles delivery and ripeness",
            description: "What to expect after placing a manual mango order online.",
          },
        ]
      : [
          {
            title: "কীভাবে সঠিক mango pack size বাছবেন",
            description: "একজনের জন্য, পরিবারের জন্য, বা gifting order-এর জন্য একটি দ্রুত গাইড।",
          },
          {
            title: "কোন আমের জাত আপনার স্বাদের সাথে মানাবে",
            description: "মিষ্টতা, ঘ্রাণ, texture, আর কোন সময় কোন জাত অর্ডার করা ভালো।",
          },
          {
            title: "FreshBitan কীভাবে delivery আর ripeness handle করে",
            description: "অনলাইনে manual mango order দেওয়ার পর কী আশা করবেন।",
          },
        ];

  const varietySpotlights =
    locale === "en"
      ? [
          {
            title: "Himsagar for refined sweetness",
            description: "A premium favorite for buyers who want fragrance, smooth flesh, and a gifting-friendly finish.",
          },
          {
            title: "Langra for depth and nostalgia",
            description: "Balanced sweetness with a fuller traditional profile for families who love classic seasonal flavor.",
          },
          {
            title: "Fazli for bigger home packs",
            description: "A practical choice for larger households, shared tables, and late-season mango planning.",
          },
        ]
      : [
          {
            title: "পরিশীলিত মিষ্টতার জন্য হিমসাগর",
            description: "যারা ঘ্রাণ, নরম শাঁস, আর gifting-friendly premium finish চান, তাদের জন্য সেরা পছন্দগুলোর একটি।",
          },
          {
            title: "গভীর স্বাদ ও nostalgia-র জন্য ল্যাংড়া",
            description: "পরিবারের classic seasonal স্বাদের জন্য balanced sweetness আর পরিচিত ঘরোয়া feel নিয়ে আসে।",
          },
          {
            title: "বড় household pack-এর জন্য ফজলি",
            description: "বড় পরিবার, shared table, আর late-season mango planning-এর জন্য একটি practical choice।",
          },
        ];

  const signaturePromises =
    locale === "en"
      ? [
          "Mango-first premium curation",
          "Bangladesh-ready delivery support",
          "Manual order flow with human confirmation",
        ]
      : [
          "শুধু আম-কেন্দ্রিক premium curation",
          "বাংলাদেশ-ready delivery support",
          "মানুষের confirmation সহ manual order flow",
        ];

  return (
    <main className="pb-8 sm:pb-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:gap-12 sm:px-6 sm:py-8 lg:px-10 lg:gap-20 lg:py-14">
        <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-8">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#dce8c8] bg-[linear-gradient(135deg,#f6fbe8,#fff5cf_46%,#f6d56d)] p-4 shadow-[0_26px_70px_rgba(89,98,30,0.14)] sm:rounded-[2.4rem] sm:p-8 lg:p-10">
            <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/40 blur-3xl sm:-top-12 sm:-right-12 sm:h-52 sm:w-52" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#84a93f]/14 blur-3xl sm:h-48 sm:w-48" />
            <span className="relative z-10 inline-flex max-w-full rounded-full border border-[#84a93f]/25 bg-white/75 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5b6c1f] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]">
              {siteContent.heroBadge}
            </span>
            <div className="relative z-10 mt-5 max-w-3xl space-y-3 sm:mt-8 sm:space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#708432] sm:text-sm sm:tracking-[0.22em]">
                {siteContent.tagline}
              </p>
              <h1 className="font-display text-[1.95rem] leading-[1.02] text-brand-deep sm:text-5xl lg:text-6xl">
                {siteContent.heroTitle}
              </h1>
              <p className="max-w-2xl text-[13px] leading-6 text-[#5d5b45] sm:text-lg sm:leading-8">
                {siteContent.heroDescription}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/products"
                className={`${buttonVariants({
                  variant: "primary",
                  size: "md",
                  fullWidth: true,
                })} min-h-11 sm:min-h-13 sm:w-auto sm:px-6`}
              >
                {locale === "en" ? "Browse mango varieties" : "আমের জাত দেখুন"}
              </Link>
              <a
                href={buildWhatsappLink(siteContent.whatsappNumber, siteContent.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className={`${buttonVariants({
                  variant: "whatsapp",
                  size: "md",
                  fullWidth: true,
                })} min-h-11 sm:min-h-13 sm:w-auto sm:px-6`}
              >
                {locale === "en" ? "Order on WhatsApp" : "WhatsApp-এ অর্ডার করুন"}
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5">
            <article className="hidden rounded-[1.75rem] border border-[#dfe8cb] bg-white/80 p-5 shadow-[0_18px_50px_rgba(89,98,30,0.10)] sm:block sm:rounded-[2rem] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
                {locale === "en" ? "Customer trust" : "গ্রাহকের আস্থা"}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.2rem] border border-border bg-[#fafcf4] p-4 sm:rounded-[1.4rem]">
                    <p className="text-2xl font-bold text-brand-deep">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="hidden rounded-[1.75rem] border border-[#dfe8cb] bg-[linear-gradient(180deg,#ffffff,#f5f8ea)] p-5 shadow-[0_18px_50px_rgba(89,98,30,0.10)] sm:block sm:rounded-[2rem] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
                {locale === "en" ? "Seasonal availability" : "মৌসুমি প্রাপ্যতা"}
              </p>
              <p className="mt-4 text-sm leading-7 text-muted">{siteContent.seasonalNote}</p>
              <Link
                href="/products"
                className={`${buttonVariants({
                  variant: "outline",
                  size: "md",
                  fullWidth: true,
                })} mt-6 sm:w-auto`}
              >
                {locale === "en" ? "See pack sizes" : "প্যাক সাইজ দেখুন"}
              </Link>
            </article>
          </div>
        </section>

        <section className="hidden gap-4 sm:gap-6 md:grid lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[1.8rem] border border-[#dfe8cb] bg-[linear-gradient(135deg,#fffdf5,#eef6dd)] p-5 shadow-[0_20px_60px_rgba(89,98,30,0.10)] sm:rounded-[2.2rem] sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
              {locale === "en" ? "Bangladesh Mango Signature" : "বাংলাদেশি আমের স্বাক্ষর"}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-[2rem] leading-[1.08] text-brand-deep sm:mt-5 sm:text-4xl">
              {locale === "en"
                ? "FreshBitan presents a premium mango story shaped by region, season, and pack size choice."
                : "FreshBitan এমন এক premium mango story তুলে ধরে, যা অঞ্চল, মৌসুম, আর pack size choice দিয়ে গঠিত।"}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4f542f] sm:mt-5 sm:text-base sm:leading-8">
              {locale === "en"
                ? "Instead of a crowded fruit shop layout, the homepage now focuses on what actually matters to mango buyers in Bangladesh: trusted sourcing, clear variety context, pack-size flexibility, and a simple order path."
                : "একটি ভিড়ভাট্টার fruit shop layout-এর বদলে, এখন homepage ঠিক সেই জিনিসগুলোকে গুরুত্ব দেয় যেগুলো বাংলাদেশি mango buyer-এর কাছে সবচেয়ে গুরুত্বপূর্ণ: trusted sourcing, clear variety context, pack-size flexibility, আর simple order path।"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
              {signaturePromises.map((promise) => (
                <span
                  key={promise}
                  className="rounded-full border border-[#d7dcbf] bg-white/80 px-3.5 py-2 text-[13px] font-semibold text-brand-deep sm:px-4 sm:text-sm"
                >
                  {promise}
                </span>
              ))}
            </div>
          </article>

          <div className="hidden gap-4 md:grid">
            {varietySpotlights.map((spotlight) => (
              <article
                key={spotlight.title}
                className="rounded-[1.6rem] border border-[#dde7ca] bg-white/85 p-5 shadow-[0_18px_50px_rgba(89,98,30,0.08)] sm:rounded-[1.8rem] sm:p-6"
              >
                <h3 className="text-xl font-semibold text-brand-deep">{spotlight.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{spotlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8 sm:space-y-10">
          {productShowcaseSections.map((section) => (
            <div
              key={section.title}
              className="rounded-[1.9rem] border border-[#dfe8cb] bg-white/70 p-5 shadow-[0_18px_55px_rgba(89,98,30,0.08)] sm:rounded-[2.1rem] sm:p-8"
            >
              <SectionHeading
                eyebrow={section.eyebrow}
                title={section.title}
                description={section.description}
              />
              {section.products.length > 0 ? (
                <HomeProductSlider products={section.products} />
              ) : (
                <div className="mt-8">
                  <EmptyState
                    title={
                      locale === "en"
                        ? "Products for this section are coming soon"
                        : "এই section-এর পণ্যগুলো শিগগিরই আসছে"
                    }
                    description={
                      locale === "en"
                        ? "Once products are published in the dashboard, this showcase will fill automatically."
                        : "ড্যাশবোর্ডে পণ্য publish হলে এই showcase স্বয়ংক্রিয়ভাবে পূর্ণ হবে।"
                    }
                    actionHref="/products"
                    actionLabel={
                      locale === "en" ? "Browse all products" : "সব পণ্য দেখুন"
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {whyChooseItems.map((item) => (
            <article key={item.title} className="rounded-[1.65rem] border border-[#dde7ca] bg-white/80 p-5 shadow-[0_18px_50px_rgba(89,98,30,0.08)] sm:rounded-[1.85rem] sm:p-6">
              <h3 className="text-xl font-semibold text-brand-deep">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-[#dfe8cb] bg-[linear-gradient(180deg,#f8fbef,#ffffff)] p-6 shadow-[0_20px_60px_rgba(89,98,30,0.10)] sm:rounded-[2.2rem] sm:p-10">
          <SectionHeading
            eyebrow={locale === "en" ? "Orchard To Home" : "বাগান থেকে ঘরে"}
            title={locale === "en" ? "A mango journey designed for trust, not confusion" : "বিশ্বাসের জন্য সাজানো এক mango journey"}
            description={locale === "en" ? "FreshBitan keeps the process simple so customers understand where the mangoes come from, how they are packed, and how ordering works." : "FreshBitan পুরো প্রক্রিয়াকে সহজ রাখে, যাতে গ্রাহক বুঝতে পারেন আম কোথা থেকে আসে, কীভাবে প্যাক হয়, আর অর্ডার কীভাবে এগোয়।"}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orchardSteps.map((step, index) => (
              <article key={step.title} className="rounded-[1.5rem] border border-border bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
                  {locale === "en" ? `Step ${index + 1}` : `ধাপ ${index + 1}`}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-brand-deep">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[#dfe8cb] bg-white/80 p-6 shadow-[0_20px_60px_rgba(89,98,30,0.08)] sm:rounded-[2.2rem] sm:p-10">
            <SectionHeading
              eyebrow={locale === "en" ? "Season Calendar" : "সিজন ক্যালেন্ডার"}
              title={locale === "en" ? "Know which mangoes arrive when" : "কোন আম কখন আসে তা সহজে জানুন"}
              description={locale === "en" ? "Availability changes through the season, so we prepare buyers with a clearer calendar and realistic expectations." : "মৌসুমজুড়ে availability বদলায়, তাই আমরা গ্রাহককে পরিষ্কার calendar আর বাস্তব expectation দিয়ে প্রস্তুত রাখি।"}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {seasonalAvailabilityItems.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-border bg-[#fafcf4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#708432]">
                    {item.months}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-brand-deep">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#dfe8cb] bg-[linear-gradient(180deg,#fff8df,#ffffff)] p-6 shadow-[0_20px_60px_rgba(89,98,30,0.08)] sm:rounded-[2.2rem] sm:p-10">
            <SectionHeading
              eyebrow={locale === "en" ? "Packaging And Delivery" : "প্যাকেজিং ও ডেলিভারি"}
              title={locale === "en" ? "Made for practical Bangladesh delivery" : "বাংলাদেশের practical delivery মাথায় রেখে"}
              description={locale === "en" ? "The goal is simple: premium mangoes should arrive looking cared for, not rushed." : "লক্ষ্য একটাই: প্রিমিয়াম আম যেন পৌঁছায় যত্নের অনুভূতি নিয়ে, তাড়াহুড়ো করে নয়।"}
            />
            <div className="mt-8 space-y-4">
              {packagingCards.map((card) => (
                <article key={card.title} className="rounded-[1.5rem] border border-border bg-white p-5">
                  <h3 className="text-lg font-semibold text-brand-deep">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[2rem] border border-[#dfe8cb] bg-[linear-gradient(135deg,#edf5d9,#fff7d6)] p-6 shadow-[0_20px_60px_rgba(89,98,30,0.10)] sm:rounded-[2.2rem] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
              {locale === "en" ? "Orchard Story" : "বাগানের গল্প"}
            </p>
            <h2 className="mt-5 font-display text-3xl text-brand-deep sm:text-4xl">
              {locale === "en" ? "FreshBitan is built around trusted mango seasons, not random catalog expansion." : "FreshBitan তৈরি হয়েছে বিশ্বস্ত আমের মৌসুমকে ঘিরে, random catalog expansion-এর জন্য নয়।"}
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#4f542f] sm:text-base">
              {locale === "en" ? "That is why the storefront is now mango-only. The brand promise becomes clearer when every section, every product card, and every order flow is designed around premium Bangladeshi mangoes." : "এই কারণেই storefront এখন শুধুই mango-focused। যখন প্রতিটি section, product card, আর order flow প্রিমিয়াম বাংলাদেশি আমকে ঘিরে সাজানো হয়, তখন brand promise অনেক বেশি পরিষ্কার হয়ে ওঠে।"}
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#dfe8cb] bg-white/80 p-6 shadow-[0_20px_60px_rgba(89,98,30,0.08)] sm:rounded-[2.2rem] sm:p-10">
            <SectionHeading
              eyebrow={locale === "en" ? "Buying Guide" : "কেনার গাইড"}
              title={locale === "en" ? "A better mango buying experience starts with better guidance" : "ভালো guidance থেকেই শুরু হয় ভালো mango buying experience"}
              description={locale === "en" ? "These guide-style highlights help first-time buyers make a more confident choice." : "এই guide-style highlight প্রথমবারের ক্রেতাকেও আরও আত্মবিশ্বাসী সিদ্ধান্ত নিতে সাহায্য করে।"}
            />
            <div className="mt-8 grid gap-4">
              {buyingGuides.map((guide, index) => (
                <article key={guide.title} className="rounded-[1.5rem] border border-border bg-[#fafcf4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
                    {locale === "en" ? `Guide ${index + 1}` : `গাইড ${index + 1}`}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-brand-deep">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{guide.description}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow={locale === "en" ? "Customer Reviews" : "গ্রাহকের রিভিউ"}
            title={locale === "en" ? "Trust grows after delivery" : "ডেলিভারির পরই গড়ে ওঠে আসল আস্থা"}
            description={locale === "en" ? "Approved customer testimonials from the backend reviews API are previewed here." : "Backend reviews API থেকে approve হওয়া গ্রাহক testimonial এখানে দেখানো হয়।"}
          />
          {testimonials.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {testimonials.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={locale === "en" ? "Reviews will appear here" : "রিভিউ এখানে দেখানো হবে"}
              description={locale === "en" ? "As approved mango delivery reviews arrive, this section will fill automatically." : "Approved mango delivery review এলে এই section স্বয়ংক্রিয়ভাবে পূর্ণ হবে।"}
              actionHref="/reviews"
              actionLabel={locale === "en" ? "Visit reviews page" : "রিভিউ পেজ দেখুন"}
            />
          )}
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-[#dfe8cb] bg-white/80 p-6 shadow-[0_20px_60px_rgba(89,98,30,0.08)] sm:rounded-[2.2rem] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <SectionHeading
            eyebrow="FAQ"
            title={locale === "en" ? "Common questions before placing a mango order" : "ম্যাংগো অর্ডার দেওয়ার আগে সাধারণ প্রশ্ন"}
            description={locale === "en" ? "A few direct answers help buyers move from interest to confident action." : "কয়েকটি সরাসরি উত্তর ক্রেতাকে আগ্রহ থেকে আত্মবিশ্বাসী পদক্ষেপে নিতে সাহায্য করে।"}
          />
          <FaqAccordion items={faqItems} />
        </section>

        <section className="rounded-[2rem] border border-[#dfe8cb] bg-[linear-gradient(135deg,#f0f7df,#fff5cf)] p-6 text-center shadow-[0_22px_70px_rgba(89,98,30,0.10)] sm:rounded-[2.4rem] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#708432]">
            {locale === "en" ? "Final Order CTA" : "শেষ অর্ডার আহ্বান"}
          </p>
          <h2 className="mt-5 font-display text-3xl text-brand-deep sm:text-5xl">
            {locale === "en" ? "Choose your mango variety, pick a pack size, and place a simple trusted order." : "পছন্দের আম বেছে নিন, pack size ঠিক করুন, আর সহজ trusted order দিন।"}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-[#4f542f] sm:text-base">
            {locale === "en" ? "FreshBitan keeps the process practical with Cash on Delivery and manual local support instead of complicated payment flows." : "FreshBitan জটিল payment flow নয়, বরং Cash on Delivery আর সহজ local support দিয়ে ordering-কে practical রাখে।"}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className={`${buttonVariants({
                variant: "primary",
                size: "lg",
                fullWidth: true,
              })} sm:w-auto`}
            >
              {t.common.orderNow}
            </Link>
            <a
              href={buildWhatsappLink(siteContent.whatsappNumber, siteContent.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className={`${buttonVariants({
                variant: "whatsapp",
                size: "lg",
                fullWidth: true,
              })} sm:w-auto`}
            >
              {locale === "en" ? "Talk to FreshBitan" : "FreshBitan-এর সাথে কথা বলুন"}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
