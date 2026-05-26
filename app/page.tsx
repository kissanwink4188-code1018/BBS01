import { Header } from "@/components/Header";
import { PostList } from "@/components/PostList";
import {
  fetchNicknamesByAuthorIds,
  fetchPosts,
} from "@/lib/posts/queries";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = await fetchPosts(supabase);
  const nicknames = user
    ? await fetchNicknamesByAuthorIds(
        supabase,
        posts.map((post) => post.author_id),
      )
    : {};

  return (
    <>
      <Header email={user?.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">게시글</h1>
        <PostList
          posts={posts}
          nicknames={nicknames}
          currentUserId={user?.id}
        />
      </main>
    </>
  );
}
