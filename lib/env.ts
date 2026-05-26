export type SupabaseEnv = {
  url: string;
  key: string;
};

const readEnv = (name: string): string | undefined => {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
};

/** Supabase 클라이언트용 URL·키 (publishable 우선, 없으면 legacy anon) */
export const getSupabaseEnv = (): SupabaseEnv => {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key =
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL이 없습니다. .env.local을 확인하세요.",
    );
  }

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.",
    );
  }

  return { url, key };
};
