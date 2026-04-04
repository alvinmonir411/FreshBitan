import { getPublicSettings } from "@/lib/api";
import { publicEnv } from "@/lib/env";
import { SiteSetting } from "@/types/api";
import {
  FaqItem,
  HighlightItem,
  NavigationItem,
  SeasonalAvailabilityItem,
  SiteContent,
} from "@/types/site";

const defaultSiteContent: SiteContent = {
  brandName: publicEnv.brandName,
  logoUrl: "",
  tagline: "Bangladesh mango and seasonal fruit ecommerce brand",
  heroBadge: "সরাসরি বাগান থেকে টাটকা আম",
  heroTitle: "বাংলাদেশজুড়ে প্রিমিয়াম আম ও seasonal fruit delivery",
  heroDescription:
    "FreshBitan brings trusted mangoes and seasonal fruits from orchard regions to your doorstep with careful packaging, honest quality, and mobile-first ordering.",
  deliveryPromise: "বাংলাদেশজুড়ে নিরাপদ ডেলিভারি",
  aboutSummary:
    "FreshBitan works with a quality-first sourcing process so each shipment feels fresh, dependable, and gift-worthy.",
  seasonalNote:
    "আমের মৌসুমে variety-wise harvest update, careful sorting, and planned dispatch help us keep each box fresher for longer.",
  footerNote: "বিশ্বস্ত মান, নিরাপদ প্যাকেজিং, দ্রুত ডেলিভারি",
  phone: "+880 1700-000000",
  email: "hello@freshbitan.com",
  address: "Rajshahi sourcing network with delivery support across Bangladesh",
  whatsappNumber: "8801700000000",
  whatsappMessage: "FreshBitan থেকে আম অর্ডার করতে চাই।",
  facebookUrl: "https://www.facebook.com/",
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

const mapSiteContent = (settings: SiteSetting[]): SiteContent => {
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

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export const whyChooseItems: HighlightItem[] = [
  {
    title: "Orchard-first sourcing",
    description:
      "আমের freshness ধরে রাখতে orchard-to-dispatch workflow carefully planned so you receive a cleaner, better-tasting box.",
  },
  {
    title: "Safe packaging",
    description:
      "প্রতিটি parcel-এ sorting, padding, and delivery-ready packaging keeps the fruit safer in transit.",
  },
  {
    title: "Bangladesh-wide support",
    description:
      "District-level delivery planning, WhatsApp-first assistance, and honest communication make ordering easier.",
  },
];

export const seasonalAvailabilityItems: SeasonalAvailabilityItem[] = [
  {
    title: "গোপালভোগ",
    months: "মে - জুন",
    description: "Early-season sweetness with a soft aroma and festive table appeal.",
  },
  {
    title: "হিমসাগর / ক্ষিরসাপাত",
    months: "জুন",
    description: "Rich texture, balanced sweetness, and one of the most requested premium picks.",
  },
  {
    title: "ল্যাংড়া",
    months: "জুন - জুলাই",
    description: "A strong seasonal favorite for families who want fuller flavor and depth.",
  },
  {
    title: "আম্রপালি ও late season picks",
    months: "জুলাই - আগস্ট",
    description: "Late-season options for customers who want extended mango enjoyment.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "FreshBitan-এর আম কোথা থেকে আসে?",
    answer:
      "আমরা orchard-region sourcing model follow করি এবং quality check-এর পর delivery-ready stock dispatch করি.",
  },
  {
    question: "বাংলাদেশজুড়ে delivery করা হয়?",
    answer:
      "হ্যাঁ, location অনুযায়ী delivery planning করা হয় এবং WhatsApp-এ order support দেওয়া হয়.",
  },
  {
    question: "অর্ডার করার সবচেয়ে সহজ উপায় কী?",
    answer:
      "আপনি product page, contact page quick order form, বা সরাসরি WhatsApp-এর মাধ্যমে inquiry বা order শুরু করতে পারেন.",
  },
  {
    question: "Packaging কি safe?",
    answer:
      "বিশ্বস্ত মান, নিরাপদ প্যাকেজিং, দ্রুত ডেলিভারি - এই তিনটি বিষয়কে আমরা fulfilment-এর মূল ভিত্তি হিসেবে রাখি.",
  },
];

export const contactHighlights: HighlightItem[] = [
  {
    title: "আজই অর্ডার করুন",
    description:
      "Quick order form বা WhatsApp message দিয়ে same-day inquiry শুরু করুন.",
  },
  {
    title: "Bangla-friendly support",
    description:
      "Customer support flow বাংলা ও simple কথোপকথনের জন্য friendly রাখা হয়েছে.",
  },
  {
    title: "Trusted fruit gifting",
    description:
      "Family orders, repeat buyers, and seasonal gifting needs মাথায় রেখে fulfilment plan করা হয়.",
  },
];

export const getSiteContent = async () => {
  const settings = await getPublicSettings();
  return mapSiteContent(settings);
};
