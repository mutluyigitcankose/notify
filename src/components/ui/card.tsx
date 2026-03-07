import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-black/10 bg-[var(--card)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:border-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
