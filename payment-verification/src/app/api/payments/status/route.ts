import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }
  // Search by email or UTR
  const { data, error } = await supabase
    .from("payments")
    .select("name, email, amount, utr, screenshot_url, status")
    .or(`email.eq.${query},utr.eq.${query}`)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  return NextResponse.json({ payment: data?.[0] || null });
}