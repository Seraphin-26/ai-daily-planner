import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  glass = true,
  padding = "md",
  className,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors duration-300",
        glass
          ? "bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-none"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
