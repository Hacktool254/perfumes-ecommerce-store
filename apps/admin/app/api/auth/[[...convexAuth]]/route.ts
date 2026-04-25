import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Auth handled by middleware" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Auth handled by middleware" }, { status: 200 });
}
