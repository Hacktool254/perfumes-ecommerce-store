// Authentication for @convex-dev/auth is handled entirely by the middleware
// in src/middleware.ts. The middleware intercepts requests to /api/auth and
// proxies them to the Convex backend. No route handler is needed here.
//
// However, Next.js requires a route file to exist so the path is recognized.
// Exporting GET/POST as no-ops ensures Next.js doesn't 404 on this path
// if the middleware somehow doesn't intercept (e.g., during build).

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Auth handled by middleware" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Auth handled by middleware" }, { status: 200 });
}
