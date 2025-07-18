import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = form.get("name") as string;
  const email = form.get("email") as string;
  const amount = parseInt(form.get("amount") as string, 10);
  const utr = form.get("utr") as string;
  const screenshot = form.get("screenshot") as File | null;
  if (!name || !email || !amount || !utr || !screenshot) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const id = uuidv4();
  // Upload screenshot to Supabase Storage
  const ext = screenshot.name.split(".").pop();
  const filePath = `${id}.${ext}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("payment_screenshots")
    .upload(filePath, screenshot, { contentType: screenshot.type });
  if (uploadError) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
  const screenshot_url = supabase.storage.from("payment_screenshots").getPublicUrl(filePath).data.publicUrl;
  // Insert payment record
  const { error: dbError } = await supabase.from("payments").insert([
    {
      id,
      name,
      email,
      amount,
      utr,
      screenshot_url,
      status: "Pending",
      created_at: new Date().toISOString(),
    },
  ]);
  if (dbError) {
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true, id });
}