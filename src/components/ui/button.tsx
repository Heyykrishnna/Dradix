import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none overflow-hidden cursor-pointer active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/50 after:absolute after:top-0 after:left-[15%] after:right-[15%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[radial-gradient(95%_60%_at_50%_75%,#005451_0%,#002927_100%)] text-white shadow-[0px_4px_20px_-6px_rgba(0,60,58,0.6),inset_0px_1px_3px_0px_rgba(255,255,255,0.4)] hover:brightness-110",
        candy:
          "bg-[radial-gradient(95%_60%_at_50%_75%,#005451_0%,#002927_100%)] text-white shadow-[0px_4px_24px_-6px_rgba(0,60,58,0.6),inset_0px_1px_4px_0px_rgba(255,255,255,0.4)] hover:brightness-110",
        outline:
          "border-zinc-700/60 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-md text-zinc-200 shadow-[0px_4px_16px_-4px_rgba(0,0,0,0.3),inset_0px_1px_2px_0px_rgba(255,255,255,0.2)] hover:bg-zinc-800/90 hover:text-white hover:brightness-110",
        secondary:
          "bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 text-zinc-100 border border-zinc-700/50 shadow-[0px_4px_16px_-4px_rgba(0,0,0,0.4),inset_0px_1px_2px_0px_rgba(255,255,255,0.25)] hover:brightness-110",
        ghost:
          "bg-gradient-to-b from-white/5 to-transparent text-zinc-300 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.15)] hover:bg-white/10 hover:text-white hover:brightness-110",
        destructive:
          "bg-[radial-gradient(95%_60%_at_50%_75%,#dc2626_0%,#991b1b_100%)] text-white shadow-[0px_4px_20px_-6px_rgba(220,38,38,0.6),inset_0px_1px_3px_0px_rgba(255,255,255,0.4)] hover:brightness-110",
        link: "text-primary underline-offset-4 hover:underline after:hidden shadow-none rounded-none px-0 py-0",
      },
      size: {
        default:
          "h-9 gap-2 px-4 py-2 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
