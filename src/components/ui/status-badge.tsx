import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        success:
          "bg-success/10 text-success border border-success/30 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-success",
        warning:
          "bg-warning/10 text-warning border border-warning/30 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-warning",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/30 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-destructive",
        info: "bg-info/10 text-info border border-info/30 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-info",
        neutral:
          "bg-neutral/10 text-neutral border border-neutral/30 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-neutral",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode
  showDot?: boolean
}

/**
 * Status Badge Komponente
 * Zeigt Status mit Farbcodierung und Punkt an
 *
 * Verwendung:
 * ```tsx
 * <StatusBadge variant="success">Aktiv</StatusBadge>
 * <StatusBadge variant="warning">Überprüfung nötig</StatusBadge>
 * <StatusBadge variant="destructive">Fehler</StatusBadge>
 * ```
 */
const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, variant, size, children, showDot = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusBadgeVariants({ variant, size }), className, !showDot && "before:hidden")}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
