import { cn } from "@/utils/styles";
import { type ComponentProps, type FC } from "react";

type Props = {
  variant: "primary" | "secondary" | "ghost" | "icon";
  size: "sm" | "md" | "lg";
  className?: string;
} & ComponentProps<"button">;
// } & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<Props> = ({
  variant,
  size,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-4xl font-medium transition-all focus:outline-none",
        variant === "primary" &&
          "bg-plum-500 text-white hover:bg-plum-600 focus:ring-plum-500 active:bg-plum-700",
        variant === "secondary" &&
          "bg-plum-400/40 text-plum-400 hover:scale-107 hover:bg-plum-400/40 focus:ring-plum-400 active:scale-95 active:bg-plum-400/60 active:text-plum-300",
        variant === "ghost" &&
          "bg-transparent p-3 text-base text-plum-200 hover:ring-1 hover:ring-plum-300",
        variant === "icon" && "p-0",

        size === "sm" && "px-2 py-1.5 text-xs",
        size === "md" && "px-6 py-3 text-base",
        size === "lg" && "px-8 py-4 text-lg",
        variant === "icon" && size === "sm" && "p-0",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
