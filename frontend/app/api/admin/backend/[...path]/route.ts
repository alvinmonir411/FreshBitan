import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth-server";
import { publicEnv } from "@/lib/env";

const apiBase = publicEnv.apiUrl.replace(/\/+$/, "");

const proxyRequest = async (
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string,
) => {
  const session = await getAdminSession();

  if (!session) {
    const response = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    clearAdminSession(response);
    return response;
  }

  const { path } = await params;
  const targetUrl = `${apiBase}/${path.join("/")}${request.nextUrl.search}`;
  const body =
    method === "GET" || method === "DELETE"
      ? undefined
      : await request.text();

  const backendResponse = await fetch(targetUrl, {
    method,
    headers: {
      Authorization: `Bearer ${session.token}`,
      ...(body ? { "Content-Type": request.headers.get("content-type") ?? "application/json" } : {}),
    },
    body,
    cache: "no-store",
  });

  const text = await backendResponse.text();
  const response = new NextResponse(text, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") ?? "application/json",
    },
  });

  if (backendResponse.status === 401) {
    clearAdminSession(response);
  }

  return response;
};

export function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params, "GET");
}

export function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params, "POST");
}

export function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params, "PATCH");
}

export function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params, "PUT");
}

export function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context.params, "DELETE");
}
