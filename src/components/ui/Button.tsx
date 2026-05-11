import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const classes = {
  base: "button",
  variant: {
    primary: "button-primary",
    secondary: "button-secondary",
    ghost: "button-ghost",
    danger: "button-danger"
  },
  size: {
    sm: "button-sm",
    md: "button-md",
    lg: "button-lg"
  }
};

export function Button({ children, variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button className={cn(classes.base, classes.variant[variant], classes.size[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, variant = "primary", size = "md", className, href, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(classes.base, classes.variant[variant], classes.size[size], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
