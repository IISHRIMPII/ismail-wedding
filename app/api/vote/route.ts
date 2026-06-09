import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { media_id } = await req.json();

  if (!media_id) {
    return NextResponse.json({ error: "Missing media_id" }, { status: 400 });
  }

  // Increment votes using RPC (atomic)
  const { error } = await supabase.rpc("increment_votes", { row_id: media_id });

  if (error) {
    // Fallback: manual increment
    const { data: current } = await supabase
      .from("media")
      .select("votes")
      .eq("id", media_id)
      .single();

    const { error: updateError } = await supabase
      .from("media")
      .update({ votes: (current?.votes ?? 0) + 1 })
      .eq("id", media_id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
