import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const variantClass: Record<Variant, string> = {
  primary:
    "border-transparent bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border-border bg-surface text-text hover:border-accent hover:text-accent",
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-card px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

function cn(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(baseClass, variantClass[variant], className);

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<
    ButtonAsButton,
    keyof CommonProps
  >;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {children}
    </button>
  );
}
