import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12">
        <h1 className="mb-6 text-2xl font-bold">회원가입</h1>
        <AuthForm mode="signup" action={signUp} />
        <p className="mt-6 text-sm text-slate-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            로그인
          </Link>
        </p>
      </main>
    </>
  );
}
