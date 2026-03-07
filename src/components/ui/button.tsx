import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90",
        secondary:
          "bg-[var(--card)] px-4 py-2 text-[var(--foreground)] ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5",
        ghost: "px-3 py-2 text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children: ReactNode;
  };

export function Button({ className, variant, asChild, children, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </Comp>
  );
}
