import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "quiet";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "nb-press border-2 border-rule bg-amber text-ink hover:bg-amber-hover",
  ghost: "nb-press border-2 border-rule bg-panel text-ink hover:bg-sunk",
  quiet: "text-muted underline-offset-4 hover:text-text hover:underline",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

export function Button({
  children,
  variant,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center px-4 font-head text-meta font-bold uppercase tracking-wide",
        "disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
