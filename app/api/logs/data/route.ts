import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  return NextResponse.json({ logs: logger.getLogs() });
}

export async function DELETE() {
  logger.clear();
  return NextResponse.json({ ok: true });
}
