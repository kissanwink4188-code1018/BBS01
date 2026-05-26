export type PostInput = {
  title: string;
  content: string;
};

export type PostValidationResult =
  | { ok: true; value: PostInput }
  | { ok: false; error: string };

export const validatePostInput = (
  title: unknown,
  content: unknown,
): PostValidationResult => {
  if (typeof title !== "string" || typeof content !== "string") {
    return { ok: false, error: "제목과 내용을 입력해 주세요." };
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (trimmedTitle.length === 0) {
    return { ok: false, error: "제목을 입력해 주세요." };
  }

  if (trimmedContent.length === 0) {
    return { ok: false, error: "내용을 입력해 주세요." };
  }

  return {
    ok: true,
    value: { title: trimmedTitle, content: trimmedContent },
  };
};

export const canEditPost = (
  userId: string | undefined,
  authorId: string,
): boolean => userId !== undefined && userId === authorId;
