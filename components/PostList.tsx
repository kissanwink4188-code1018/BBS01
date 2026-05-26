import Link from "next/link";
import type { PostRow } from "@/lib/types/database";
import { canEditPost } from "@/lib/validation/post";

type PostListProps = {
  posts: PostRow[];
  nicknames: Record<string, string>;
  currentUserId?: string;
};

const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

export const PostList = ({
  posts,
  nicknames,
  currentUserId,
}: PostListProps) => {
  if (posts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        아직 게시글이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => {
        const authorLabel =
          nicknames[post.author_id] ?? `${post.author_id.slice(0, 8)}…`;
        const editable = canEditPost(currentUserId, post.author_id);

        return (
          <li
            key={post.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-lg font-semibold text-slate-900 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  {authorLabel} · {formatDate(post.created_at)}
                </p>
              </div>
              {editable ? (
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="shrink-0 text-sm text-slate-600 hover:text-slate-900"
                >
                  수정
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
