"use client";

import { useActionState } from "react";
import type { PostActionState } from "@/app/actions/posts";
import { SubmitButton } from "@/components/SubmitButton";

type PostFormProps = {
  action: (
    prev: PostActionState,
    formData: FormData,
  ) => Promise<PostActionState>;
  submitLabel: string;
  defaultTitle?: string;
  defaultContent?: string;
  postId?: number;
};

const initialState: PostActionState = {};

export const PostForm = ({
  action,
  submitLabel,
  defaultTitle = "",
  defaultContent = "",
  postId,
}: PostFormProps) => {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-2xl flex-col gap-4">
      {postId !== undefined ? (
        <input type="hidden" name="postId" value={postId} />
      ) : null}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">제목</span>
        <input
          name="title"
          type="text"
          required
          defaultValue={defaultTitle}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">내용</span>
        <textarea
          name="content"
          required
          rows={8}
          defaultValue={defaultContent}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton label={submitLabel} />
    </form>
  );
};
