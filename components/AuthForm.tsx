"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    prev: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  next?: string;
};

const initialState: AuthActionState = {};

export const AuthForm = ({ mode, action, next }: AuthFormProps) => {
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {isSignup ? (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">닉네임</span>
          <input
            name="nickname"
            type="text"
            required
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="userA"
          />
        </label>
      ) : null}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">이메일</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-slate-300 px-3 py-2"
          placeholder="user@example.com"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">비밀번호</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        label={isSignup ? "회원가입" : "로그인"}
        pendingLabel={isSignup ? "가입 중…" : "로그인 중…"}
      />
    </form>
  );
};
