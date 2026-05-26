import { createPost } from "@/app/actions/posts";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header email={user?.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">글쓰기</h1>
        <PostForm action={createPost} submitLabel="등록" />
      </main>
    </>
  );
}
