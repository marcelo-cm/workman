import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = JSON.stringify("Hello, world!");
  return new NextResponse(response);
}
