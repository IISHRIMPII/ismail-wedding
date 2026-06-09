import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

// GET all media
export async function GET() {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST upload a file
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const uploaderName = formData.get("uploader_name") as string;
  const isGroomContest = formData.get("is_groom_contest") === "true";

  if (!file || !uploaderName) {
    return NextResponse.json({ error: "Missing file or name" }, { status: 400 });
  }

  // Validate file type
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Max size: 50MB
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || (isImage ? "jpg" : "mp4");
  const fileName = `${uuidv4()}.${ext}`;
  const bucket = "wedding-media";

  // Upload to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  // Insert record into DB
  const { data, error: dbError } = await supabase
    .from("media")
    .insert({
      uploader_name: uploaderName.trim(),
      file_url: urlData.publicUrl,
      file_type: isImage ? "photo" : "video",
      votes: 0,
      is_groom_contest: isGroomContest,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
