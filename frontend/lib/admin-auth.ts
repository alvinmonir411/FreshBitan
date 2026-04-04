import { AdminProfile } from "@/types/admin";

export const ADMIN_TOKEN_COOKIE = "freshbitan_admin_token";
export const ADMIN_PROFILE_COOKIE = "freshbitan_admin_profile";

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
}

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf8");
};

export const parseJwtPayload = (token: string) => {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string) => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const serializeAdminProfile = (profile: AdminProfile) =>
  encodeURIComponent(JSON.stringify(profile));

export const deserializeAdminProfile = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as AdminProfile;
  } catch {
    return null;
  }
};
