"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validatePostInput } from "@/lib/validation/post";

export type PostActionState = {
  error?: string;
};

export const createPost = async (
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  const validation = validatePostInput(
    formData.get("title"),
    formData.get("content"),
  );

  if (!validation.ok) {
    return { error: validation.error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const { error } = await supabase.from("posts").insert({
    title: validation.value.title,
    content: validation.value.content,
    author_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/");
};

export const updatePost = async (
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  const postId = Number(formData.get("postId"));

  if (!Number.isInteger(postId) || postId <= 0) {
    return { error: "잘못된 게시글입니다." };
  }

  const validation = validatePostInput(
    formData.get("title"),
    formData.get("content"),
  );

  if (!validation.ok) {
    return { error: validation.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      title: validation.value.title,
      content: validation.value.content,
    })
    .eq("id", postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/");
};

export const deletePost = async (formData: FormData): Promise<void> => {
  const postId = Number(formData.get("postId"));

  if (!Number.isInteger(postId) || postId <= 0) {
    redirect("/");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    redirect(
      `/posts/${postId}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/");
  redirect("/");
};
