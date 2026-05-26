import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import {
  fetchNicknamesByAuthorIds,
  fetchPostById,
} from "@/lib/posts/queries";
import { createClient } from "@/lib/supabase/server";
import { canEditPost } from "@/lib/validation/post";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const post = await fetchPostById(supabase, postId);

  if (!post) {
    notFound();
  }

  const nicknames = user
    ? await fetchNicknamesByAuthorIds(supabase, [post.author_id])
    : {};

  const authorLabel =
    nicknames[post.author_id] ?? `${post.author_id.slice(0, 8)}…`;
  const editable = canEditPost(user?.id, post.author_id);

  return (
    <>
      <Header email={user?.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← 목록
        </Link>
        <article className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{authorLabel}</p>
          <p className="mt-6 whitespace-pre-wrap text-slate-800">
            {post.content}
          </p>
          {editable ? (
            <div className="mt-6">
              <Link
                href={`/posts/${post.id}/edit`}
                className="text-sm font-medium text-slate-700 underline"
              >
                수정
              </Link>
            </div>
          ) : null}
        </article>
      </main>
    </>
  );
}
