import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

type HeaderProps = {
  email?: string | null;
};

export const Header = ({ email }: HeaderProps) => (
  <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
      <Link href="/" className="text-lg font-semibold text-slate-900">
        Mini Board
      </Link>

      <nav className="flex items-center gap-3 text-sm">
        {email ? (
          <>
            <span className="hidden text-slate-600 sm:inline">{email}</span>
            <Link
              href="/posts/new"
              className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
            >
              글쓰기
            </Link>
            <form action={signOut}>
              <SubmitButton label="로그아웃" variant="danger" />
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800"
            >
              회원가입
            </Link>
          </>
        )}
      </nav>
    </div>
  </header>
);
