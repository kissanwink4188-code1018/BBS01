"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "danger";
};

export const SubmitButton = ({
  label,
  pendingLabel = "처리 중…",
  variant = "primary",
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  const base =
    "rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button type="submit" disabled={pending} className={`${base} ${styles}`}>
      {pending ? pendingLabel : label}
    </button>
  );
};
