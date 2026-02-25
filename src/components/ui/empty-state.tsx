import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  iconSize?: number
}

/**
 * Empty State Komponente
 * Wird angezeigt wenn eine Liste leer ist oder keine Ergebnisse gefunden wurden
 *
 * Verwendung:
 * ```tsx
 * <EmptyState
 *   icon={FieldIcon}
 *   title="Keine Schläge vorhanden"
 *   description="Erstellen Sie einen neuen Schlag um zu starten"
 *   action={<Button>Neuer Schlag</Button>}
 * />
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, iconSize = 56, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 px-4 py-12 text-center sm:py-16 sm:px-6",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          size={iconSize}
          className="mx-auto mb-4 text-muted-foreground/60"
          strokeWidth={1.5}
        />
      )}

      <h3 className="text-lg font-semibold text-foreground md:text-xl">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-xs text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {action}
        </div>
      )}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
