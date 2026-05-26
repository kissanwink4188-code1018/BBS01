import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PostRow, ProfileRow } from "@/lib/types/database";

type Client = SupabaseClient<Database>;

export const fetchPosts = async (
  supabase: Client,
): Promise<PostRow[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author_id, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const fetchPostById = async (
  supabase: Client,
  id: number,
): Promise<PostRow | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, author_id, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchNicknamesByAuthorIds = async (
  supabase: Client,
  authorIds: readonly string[],
): Promise<Record<string, string>> => {
  if (authorIds.length === 0) {
    return {};
  }

  const uniqueIds = [...new Set(authorIds)];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nickname")
    .in("id", uniqueIds);

  if (error) {
    return {};
  }

  return Object.fromEntries(
    (data as Pick<ProfileRow, "id" | "nickname">[]).map((profile) => [
      profile.id,
      profile.nickname,
    ]),
  );
};
