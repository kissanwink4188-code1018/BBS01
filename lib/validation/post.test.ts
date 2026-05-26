import { describe, expect, it } from "vitest";
import { canEditPost, validatePostInput } from "./post";

describe("validatePostInput", () => {
  it("accepts trimmed title and content", () => {
    const result = validatePostInput("  hello  ", "  world  ");
    expect(result).toEqual({
      ok: true,
      value: { title: "hello", content: "world" },
    });
  });

  it("rejects empty title", () => {
    const result = validatePostInput("   ", "content");
    expect(result).toEqual({ ok: false, error: "제목을 입력해 주세요." });
  });

  it("rejects empty content", () => {
    const result = validatePostInput("title", "  ");
    expect(result).toEqual({ ok: false, error: "내용을 입력해 주세요." });
  });

  it("rejects non-string input", () => {
    const result = validatePostInput(null, "content");
    expect(result).toEqual({
      ok: false,
      error: "제목과 내용을 입력해 주세요.",
    });
  });
});

describe("canEditPost", () => {
  it("allows author", () => {
    expect(canEditPost("user-a", "user-a")).toBe(true);
  });

  it("denies other users", () => {
    expect(canEditPost("user-b", "user-a")).toBe(false);
  });

  it("denies anonymous", () => {
    expect(canEditPost(undefined, "user-a")).toBe(false);
  });
});
