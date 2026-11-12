import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "quiet";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-amber text-void hover:bg-amber/90",
  ghost: "border border-rule text-text hover:border-muted",
  quiet: "text-muted hover:text-text",
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
        "inline-flex min-h-8 items-center justify-center rounded-[2px] px-4 font-mono text-xs uppercase tracking-wider",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
