import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

const variantClass: Record<Variant, string> = {
  primary:
    "border-transparent bg-accent text-on-accent hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md",
  secondary:
    "border-border bg-surface text-text hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-sm",
};

const baseClass =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-medium transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

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

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = "primary", className } = props;
  const classes = cn(baseClass, variantClass[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
