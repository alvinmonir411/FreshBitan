export interface NavigationItem {
  href: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HighlightItem {
  title: string;
  description: string;
}

export interface SeasonalAvailabilityItem {
  title: string;
  months: string;
  description: string;
}

export interface SiteContent {
  brandName: string;
  logoUrl: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  deliveryPromise: string;
  aboutSummary: string;
  seasonalNote: string;
  footerNote: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  whatsappMessage: string;
  facebookUrl: string;
  deliveryChargeDhaka: number;
  deliveryChargeOutsideDhaka: number;
}
