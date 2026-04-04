import { NextRequest, NextResponse } from "next/server";
import { applyAdminSession, clearAdminSession, getAdminSession } from "@/lib/admin-auth-server";
import { publicEnv } from "@/lib/env";
import { AdminLoginResponse } from "@/types/admin";

const authUrl = `${publicEnv.apiUrl.replace(/\/+$/, "")}/auth/login`;

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  return NextResponse.json({ admin: session.admin });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const backendResponse = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await backendResponse.json().catch(() => ({
    message: "Login failed.",
  }));

  if (!backendResponse.ok) {
    return NextResponse.json(payload, { status: backendResponse.status });
  }

  const loginResponse = payload as AdminLoginResponse;
  const response = NextResponse.json({ admin: loginResponse.admin });
  applyAdminSession(response, loginResponse.accessToken, loginResponse.admin);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSession(response);
  return response;
}
