import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Wish = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export type Media = {
  id: string;
  uploader_name: string;
  file_url: string;
  file_type: "photo" | "video";
  votes: number;
  is_groom_contest: boolean;
  created_at: string;
};
