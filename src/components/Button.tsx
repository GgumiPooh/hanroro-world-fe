import { cn } from "@/utils/styles";
import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<Props> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-4xl font-medium transition-all focus:outline-none";

  const variantStyles = {
    primary:
      "bg-plum-500 text-white hover:bg-plum-600 active:bg-plum-700 focus:ring-plum-500",
    secondary:
      "bg-plum-400/20 text-plum-700 hover:bg-plum-400/40 hover:scale-110 active:scale-95 active:bg-plum-400/50 focus:ring-plum-400",
    ghost: "bg-transparent text-plum-200 hover:ring-1 hover:ring-plum-300",
    icon: "bg-plum-400/20 hover:bg-black/70 hover:scale-110 active:scale-95 active:bg-black/80",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledStyles = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";

  return (
    <button
      type="button"
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
