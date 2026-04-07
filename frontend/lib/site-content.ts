import { defaultLocale, getDictionary, localeSeo, SiteLocale } from "@/lib/locale-data";
import { getPublicSettings } from "@/lib/api";
import { publicEnv } from "@/lib/env";
import { SiteSetting } from "@/types/api";
import {
  FaqItem,
  HighlightItem,
  NavigationItem,
  SeasonalAvailabilityItem,
  SeoContent,
  SiteContent,
} from "@/types/site";

const buildDefaultSiteContent = (locale: SiteLocale): SiteContent =>
  locale === "en"
    ? {
        brandName: publicEnv.brandName,
        logoUrl: "",
        tagline: "Premium mango brand in Bangladesh",
        heroBadge: "Orchard-to-home mango delivery across Bangladesh",
        heroTitle: "Premium Bangladeshi mangoes delivered with orchard care",
        heroDescription:
          "FreshBitan brings trusted orchard-first mangoes to your doorstep with careful packaging, honest quality, and mobile-friendly ordering.",
        deliveryPromise: "Safe delivery across Bangladesh",
        aboutSummary:
          "FreshBitan follows a mango-first sourcing process so every shipment feels fresh, dependable, and gift-worthy.",
        seasonalNote:
          "During mango season we plan variety-wise updates, careful sorting, and scheduled dispatch to keep each mango box fresher for longer.",
        footerNote: "Trusted quality, careful packaging, and faster delivery",
        phone: "+880 1700-000000",
        email: "hello@freshbitan.com",
        address: "Rajshahi sourcing network with delivery support across Bangladesh",
        whatsappNumber: "8801700000000",
        whatsappMessage: "I want to place a mango order from FreshBitan.",
        facebookUrl: "https://www.facebook.com/freshbitan",
        deliveryChargeDhaka: 80,
        deliveryChargeOutsideDhaka: 120,
      }
    : {
        brandName: publicEnv.brandName,
        logoUrl: "",
        tagline: "বাংলাদেশের প্রিমিয়াম আমের ব্র্যান্ড",
        heroBadge: "বাগান থেকে ঘরে বিশ্বস্ত আমের ডেলিভারি",
        heroTitle: "বাংলাদেশজুড়ে যত্নে পৌঁছে যাচ্ছে প্রিমিয়াম আম",
        heroDescription:
          "FreshBitan orchard-first sourcing, careful packaging, আর mobile-friendly ordering-এর মাধ্যমে বিশ্বস্ত আম আপনার দরজায় পৌঁছে দেয়।",
        deliveryPromise: "বাংলাদেশজুড়ে নিরাপদ ডেলিভারি",
        aboutSummary:
          "FreshBitan quality-first sourcing process অনুসরণ করে, যাতে প্রতিটি shipment থাকে তাজা, নির্ভরযোগ্য, এবং gift-worthy.",
        seasonalNote:
          "আমের মৌসুমে variety-wise update, careful sorting, এবং planned dispatch আমাদের প্রতিটি box আরও fresh রাখতে সাহায্য করে।",
        footerNote: "বিশ্বস্ত মান, নিরাপদ প্যাকেজিং, দ্রুত ডেলিভারি",
        phone: "+880 1700-000000",
        email: "hello@freshbitan.com",
        address: "রাজশাহী sourcing network এবং সারা বাংলাদেশে delivery support",
        whatsappNumber: "8801700000000",
        whatsappMessage: "FreshBitan থেকে আম অর্ডার করতে চাই।",
        facebookUrl: "https://www.facebook.com/freshbitan",
        deliveryChargeDhaka: 80,
        deliveryChargeOutsideDhaka: 120,
      };

const settingValue = (settingsMap: Map<string, string>, key: string, fallback: string) =>
  settingsMap.get(key)?.trim() || fallback;

const settingNumberValue = (
  settingsMap: Map<string, string>,
  key: string,
  fallback: number,
) => {
  const rawValue = settingsMap.get(key)?.trim();
  const parsedValue = rawValue ? Number(rawValue) : Number.NaN;

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const mapSiteContent = (settings: SiteSetting[], locale: SiteLocale): SiteContent => {
  const defaultSiteContent = buildDefaultSiteContent(locale);
  const settingsMap = new Map(
    settings
      .filter((setting) => setting.value)
      .map((setting) => [setting.key, setting.value?.trim() ?? ""]),
  );
  const heroDescription =
    settingsMap.get("hero_subtitle")?.trim() ||
    settingsMap.get("hero_description")?.trim() ||
    defaultSiteContent.heroDescription;

  return {
    brandName: settingValue(settingsMap, "brand_name", defaultSiteContent.brandName),
    logoUrl: settingValue(settingsMap, "logo_url", defaultSiteContent.logoUrl),
    tagline: settingValue(settingsMap, "site_tagline", defaultSiteContent.tagline),
    heroBadge: settingValue(settingsMap, "hero_badge", defaultSiteContent.heroBadge),
    heroTitle: settingValue(settingsMap, "hero_title", defaultSiteContent.heroTitle),
    heroDescription,
    deliveryPromise: settingValue(
      settingsMap,
      "delivery_promise",
      defaultSiteContent.deliveryPromise,
    ),
    aboutSummary: settingValue(
      settingsMap,
      "about_summary",
      defaultSiteContent.aboutSummary,
    ),
    seasonalNote: settingValue(
      settingsMap,
      "seasonal_note",
      defaultSiteContent.seasonalNote,
    ),
    footerNote: settingValue(
      settingsMap,
      "footer_note",
      defaultSiteContent.footerNote,
    ),
    phone: settingValue(settingsMap, "contact_phone", defaultSiteContent.phone),
    email: settingValue(settingsMap, "contact_email", defaultSiteContent.email),
    address: settingValue(settingsMap, "contact_address", defaultSiteContent.address),
    whatsappNumber: settingValue(
      settingsMap,
      "whatsapp_number",
      defaultSiteContent.whatsappNumber,
    ),
    whatsappMessage: settingValue(
      settingsMap,
      "whatsapp_message",
      defaultSiteContent.whatsappMessage,
    ),
    facebookUrl: settingValue(
      settingsMap,
      "facebook_url",
      defaultSiteContent.facebookUrl,
    ),
    deliveryChargeDhaka: settingNumberValue(
      settingsMap,
      "delivery_charge_dhaka",
      defaultSiteContent.deliveryChargeDhaka,
    ),
    deliveryChargeOutsideDhaka: settingNumberValue(
      settingsMap,
      "delivery_charge_outside_dhaka",
      defaultSiteContent.deliveryChargeOutsideDhaka,
    ),
  };
};

export const getNavigationItems = (locale: SiteLocale): NavigationItem[] => {
  const t = getDictionary(locale).common;
  return [
    { href: "/", label: t.home },
    { href: "/products", label: t.products },
    { href: "/about", label: t.about },
    { href: "/reviews", label: t.reviews },
    { href: "/contact", label: t.contact },
  ];
};

export const getWhyChooseItems = (locale: SiteLocale): HighlightItem[] =>
  locale === "en"
    ? [
        { title: "Orchard-first sourcing", description: "We plan orchard-to-dispatch carefully so you receive cleaner, better-tasting mangoes." },
        { title: "Safe packaging", description: "Sorting, padding, and delivery-ready packaging help every mango travel more safely." },
        { title: "Bangladesh-wide support", description: "District-level delivery planning and WhatsApp-first communication make ordering easier." },
      ]
    : [
        { title: "Orchard-first sourcing", description: "আমের freshness ধরে রাখতে orchard-to-dispatch workflow carefully planned থাকে, যাতে আপনি আরও পরিষ্কার ও ভালো স্বাদের ফল পান।" },
        { title: "Safe packaging", description: "প্রতিটি parcel-এ sorting, padding, এবং delivery-ready packaging ফলকে পথে আরও নিরাপদ রাখে।" },
        { title: "Bangladesh-wide support", description: "District-level delivery planning, WhatsApp-first assistance, এবং honest communication অর্ডারকে সহজ করে।" },
      ];

export const getSeasonalAvailabilityItems = (locale: SiteLocale): SeasonalAvailabilityItem[] =>
  locale === "en"
    ? [
        { title: "Gopalbhog", months: "May - June", description: "An early-season variety with soft aroma and inviting sweetness." },
        { title: "Himsagar / Khirsapat", months: "June", description: "Rich texture, balanced sweetness, and one of the most requested premium picks." },
        { title: "Langra", months: "June - July", description: "A strong seasonal favorite for families who want fuller flavor and depth." },
        { title: "Amrapali and late-season picks", months: "July - August", description: "Late-season options for customers who want to extend mango season." },
      ]
    : [
        { title: "গোপালভোগ", months: "মে - জুন", description: "শুরুর দিকের মিষ্টি স্বাদ, নরম ঘ্রাণ, আর উৎসবমুখর টেবিলের জন্য দারুণ।" },
        { title: "হিমসাগর / ক্ষিরসাপাত", months: "জুন", description: "Rich texture, balanced sweetness, এবং সবচেয়ে বেশি চাওয়া premium variety-গুলোর একটি।" },
        { title: "ল্যাংড়া", months: "জুন - জুলাই", description: "যারা একটু গভীর স্বাদ চান, তাদের পরিবারের জন্য প্রিয় এক মৌসুমি পছন্দ।" },
        { title: "আম্রপালি ও late season picks", months: "জুলাই - আগস্ট", description: "যারা আরও কিছুদিন আমের মৌসুম উপভোগ করতে চান, তাদের জন্য late-season option।" },
      ];

export const getFaqItems = (locale: SiteLocale): FaqItem[] =>
  locale === "en"
    ? [
        { question: "Where do FreshBitan mangoes come from?", answer: "We follow an orchard-region sourcing model and dispatch delivery-ready stock after quality checks." },
        { question: "Do you deliver across Bangladesh?", answer: "Yes. Delivery planning is made based on location and ordering support is available through WhatsApp." },
        { question: "What is the easiest way to order?", answer: "You can start from the product page, the contact page quick order form, or directly on WhatsApp." },
        { question: "Is the packaging safe?", answer: "Trusted quality, careful packaging, and faster delivery are the three principles behind our fulfillment process." },
      ]
    : [
        { question: "FreshBitan-এর আম কোথা থেকে আসে?", answer: "আমরা orchard-region sourcing model follow করি এবং quality check-এর পর delivery-ready stock dispatch করি।" },
        { question: "বাংলাদেশজুড়ে delivery করা হয়?", answer: "হ্যাঁ, location অনুযায়ী delivery planning করা হয় এবং WhatsApp-এ order support দেওয়া হয়।" },
        { question: "অর্ডার করার সবচেয়ে সহজ উপায় কী?", answer: "আপনি product page, contact page quick order form, বা সরাসরি WhatsApp-এর মাধ্যমে inquiry বা order শুরু করতে পারেন।" },
        { question: "Packaging কি safe?", answer: "বিশ্বস্ত মান, নিরাপদ প্যাকেজিং, দ্রুত ডেলিভারি - এই তিনটি বিষয়কে আমরা fulfilment-এর মূল ভিত্তি হিসেবে রাখি।" },
      ];

export const getContactHighlights = (locale: SiteLocale): HighlightItem[] =>
  locale === "en"
    ? [
        { title: "Order today", description: "Start a same-day inquiry using the quick order form or WhatsApp." },
        { title: "Bangla-friendly support", description: "Our support flow is intentionally simple and friendly for Bangla-first customers." },
        { title: "Trusted mango gifting", description: "We plan fulfillment with family orders, repeat buyers, and seasonal mango gifting in mind." },
      ]
    : [
        { title: "আজই অর্ডার করুন", description: "Quick order form বা WhatsApp message দিয়ে same-day inquiry শুরু করুন।" },
        { title: "Bangla-friendly support", description: "Customer support flow বাংলা ও simple কথোপকথনের জন্য friendly রাখা হয়েছে।" },
        { title: "Trusted mango gifting", description: "Family orders, repeat buyers, এবং seasonal mango gifting needs মাথায় রেখে fulfilment plan করা হয়।" },
      ];

export const getBrandSeo = (locale: SiteLocale): SeoContent => ({
  title: localeSeo[locale].brandTitle,
  description: localeSeo[locale].brandDescription,
  keywords: [...localeSeo[locale].keywords],
});

export const getSiteContent = async (locale?: SiteLocale) => {
  const resolvedLocale = locale ?? defaultLocale;
  const settings = await getPublicSettings();
  return mapSiteContent(settings, resolvedLocale);
};
