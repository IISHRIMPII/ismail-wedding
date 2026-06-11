import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  const pwd = req.headers.get("x-admin-password");
  return pwd === process.env.ADMIN_PASSWORD;
}

// GET all wishes + all media
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [wishesRes, mediaRes] = await Promise.all([
    supabase.from("wishes").select("*").order("created_at", { ascending: false }),
    supabase.from("media").select("*").order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    wishes: wishesRes.data ?? [],
    media: mediaRes.data ?? [],
  });
}

// DELETE a wish or media item
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, id, file_url } = await req.json();

  if (type === "wish") {
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (type === "media") {
    // Delete from DB
    const { error: dbErr } = await supabase.from("media").delete().eq("id", id);
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

    // Delete from Storage
    if (file_url) {
      const path = file_url.split("/wedding-media/")[1];
      if (path) await supabase.storage.from("wedding-media").remove([path]);
    }
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
