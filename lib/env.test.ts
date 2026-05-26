import { afterEach, describe, expect, it } from "vitest";
import { getSupabaseEnv, tryGetSupabaseEnv } from "./env";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("getSupabaseEnv", () => {
  it("uses publishable key when set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(getSupabaseEnv()).toEqual({
      url: "https://test.supabase.co",
      key: "sb_publishable_test",
    });
  });

  it("falls back to anon key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJ-anon";

    expect(getSupabaseEnv()).toEqual({
      url: "https://test.supabase.co",
      key: "eyJ-anon",
    });
  });

  it("throws when url is missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "key";

    expect(() => getSupabaseEnv()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});

describe("tryGetSupabaseEnv", () => {
  it("returns null when env is incomplete", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(tryGetSupabaseEnv()).toBeNull();
  });
});
