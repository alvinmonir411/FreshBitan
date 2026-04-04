import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  ADMIN_PROFILE_COOKIE,
  ADMIN_TOKEN_COOKIE,
  deserializeAdminProfile,
  isJwtExpired,
  parseJwtPayload,
  serializeAdminProfile,
} from "@/lib/admin-auth";
import { AdminProfile } from "@/types/admin";

const getExpiryDate = (token: string) => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return undefined;
  }

  return new Date(payload.exp * 1000);
};

const cookieBase = (expires?: Date) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  expires,
});

export const applyAdminSession = (
  response: NextResponse,
  token: string,
  admin: AdminProfile,
) => {
  const expires = getExpiryDate(token);

  response.cookies.set(ADMIN_TOKEN_COOKIE, token, cookieBase(expires));
  response.cookies.set(
    ADMIN_PROFILE_COOKIE,
    serializeAdminProfile(admin),
    cookieBase(expires),
  );
};

export const clearAdminSession = (response: NextResponse) => {
  response.cookies.set(ADMIN_TOKEN_COOKIE, "", {
    ...cookieBase(new Date(0)),
    maxAge: 0,
  });
  response.cookies.set(ADMIN_PROFILE_COOKIE, "", {
    ...cookieBase(new Date(0)),
    maxAge: 0,
  });
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token || isJwtExpired(token)) {
    return null;
  }

  const admin = deserializeAdminProfile(
    cookieStore.get(ADMIN_PROFILE_COOKIE)?.value,
  );

  if (!admin) {
    return null;
  }

  return {
    token,
    admin,
  };
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
};
