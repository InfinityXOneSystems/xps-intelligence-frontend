import { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[oklch(0.88_0.20_95)] via-[oklch(0.85_0.19_88)] to-[oklch(0.82_0.18_80)] text-black shadow-[0_0_20px_rgba(255,223,0,0.45)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,223,0,0.65)] hover:brightness-110",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-border bg-background shadow-sm hover:bg-muted hover:border-border-hover",
        secondary:
          "bg-secondary/20 text-secondary-foreground shadow-sm hover:bg-secondary/30 border border-border",
        ghost:
          "hover:bg-muted hover:text-foreground",
        link: "text-gold underline-offset-4 hover:underline",
        maroon:
          "bg-gradient-to-r from-[oklch(0.45_0.15_25)] to-[oklch(0.38_0.13_20)] text-white shadow-sm hover:scale-[1.02] hover:brightness-110 border border-[rgba(139,0,35,0.4)]",
        silver:
          "bg-gradient-to-r from-[oklch(0.78_0.02_240)] via-[oklch(0.68_0.04_250)] to-[oklch(0.58_0.03_260)] text-white shadow-[0_0_20px_rgba(192,192,192,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(192,192,192,0.6)] hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
