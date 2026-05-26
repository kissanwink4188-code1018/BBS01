import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  const params = await searchParams;
  const next = params.next ?? "/";

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold">로그인</h1>
        {params.message === "signup" ? (
          <p className="mb-4 text-sm text-green-700">
            회원가입이 완료되었습니다. 로그인해 주세요.
          </p>
        ) : null}
        <AuthForm mode="login" action={signIn} next={next} />
        <p className="mt-6 text-sm text-slate-600">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-slate-900 underline">
            회원가입
          </Link>
        </p>
      </main>
    </>
  );
}
