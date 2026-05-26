import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deletePost, updatePost } from "@/app/actions/posts";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { SubmitButton } from "@/components/SubmitButton";
import { fetchPostById } from "@/lib/posts/queries";
import { createClient } from "@/lib/supabase/server";
import { canEditPost } from "@/lib/validation/post";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/posts/${postId}/edit`);
  }

  const post = await fetchPostById(supabase, postId);

  if (!post) {
    notFound();
  }

  if (!canEditPost(user.id, post.author_id)) {
    return (
      <>
        <Header email={user.email} />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            본인 게시글만 수정할 수 있습니다.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm underline">
            목록으로
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header email={user.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">글 수정</h1>
        {query.error ? (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {query.error}
          </p>
        ) : null}
        <PostForm
          action={updatePost}
          submitLabel="저장"
          defaultTitle={post.title}
          defaultContent={post.content}
          postId={post.id}
        />
        <form action={deletePost} className="mt-6">
          <input type="hidden" name="postId" value={post.id} />
          <SubmitButton label="삭제" variant="danger" pendingLabel="삭제 중…" />
        </form>
        <Link
          href={`/posts/${post.id}`}
          className="mt-4 inline-block text-sm text-slate-600 hover:text-slate-900"
        >
          취소
        </Link>
      </main>
    </>
  );
}
