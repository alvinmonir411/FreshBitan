import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE_NAME, defaultLocale, isSiteLocale } from "@/lib/locale-data";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = isSiteLocale(body.locale) ? body.locale : defaultLocale;
  const response = NextResponse.json({ locale });
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
