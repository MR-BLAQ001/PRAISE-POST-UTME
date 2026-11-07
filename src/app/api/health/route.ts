import { NextResponse } from "next/server";
import { bankStats } from "@/lib/questions";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "PRAISE POST UTME",
    questionBank: bankStats(),
    time: new Date().toISOString()
  });
}
