import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonVariantOptions = {}) =>
  cn(
    "inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-55",
    variant === "primary" &&
      "bg-brand px-5 text-white shadow-[0_16px_38px_rgba(239,139,30,0.28)] hover:bg-brand-deep",
    variant === "secondary" &&
      "bg-accent px-5 text-white shadow-[0_16px_38px_rgba(44,109,71,0.22)] hover:bg-[#1f5535]",
    variant === "outline" &&
      "border border-border bg-white/80 px-5 text-foreground hover:border-brand/40 hover:bg-white",
    variant === "ghost" &&
      "bg-transparent px-5 text-brand-deep hover:bg-white/55",
    variant === "whatsapp" &&
      "bg-[#22c55e] px-5 text-white shadow-[0_16px_38px_rgba(34,197,94,0.24)] hover:bg-[#16a34a]",
    size === "sm" && "min-h-10 px-4 text-sm",
    size === "md" && "min-h-11 px-5 text-sm sm:text-base",
    size === "lg" && "min-h-13 px-6 text-base",
    fullWidth && "w-full",
  );

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantOptions;

function ButtonComponent(
  { className, variant, size, fullWidth, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        className,
      )}
      {...props}
    />
  );
}

export const Button = forwardRef(ButtonComponent);
Button.displayName = "Button";
