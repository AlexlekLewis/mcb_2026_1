import "server-only";
import { getSupabaseAdmin } from "./supabase/admin";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  product: string;
  description: string;
  image_path: string;
  sort_order: number;
};

export type Project = ProjectRow & {
  imageUrl: string;
};

const BUCKET = "jobsite-images";

function publicImageUrl(path: string): string {
  const base = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function fetchProjects(): Promise<Project[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mcb_projects")
    .select("id, slug, title, category, product, description, image_path, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    ...(row as ProjectRow),
    imageUrl: publicImageUrl(row.image_path),
  }));
}
