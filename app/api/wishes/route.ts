import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET all wishes
export async function GET() {
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST a new wish
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, message } = body;

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("wishes")
    .insert({ name: name.trim(), message: message.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
