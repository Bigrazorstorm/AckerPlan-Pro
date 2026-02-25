import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "bar"
  text?: string
}

/**
 * Loader Komponente für Ladezeiten
 * Mehrere Varianten: Spinner (default), Punkte, Balken
 *
 * Wird verwendet während Daten geladen werden
 *
 * Verwendung:
 * ```tsx
 * <Loader />
 * <Loader variant="dots" text="Lädt..." />
 * <Loader variant="bar" size="lg" />
 * ```
 */
const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = "md", variant = "spinner", text, ...props }, ref) => {
    const sizeClass = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    }[size]

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-3", className)}
        {...props}
      >
        {variant === "spinner" && (
          <div
            className={cn(
              sizeClass,
              "animate-spin rounded-full border-2 border-muted border-t-primary"
            )}
            role="status"
            aria-label="Lädt"
          />
        )}

        {variant === "dots" && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary",
                  size === "sm" && "h-1.5 w-1.5",
                  size === "md" && "h-2 w-2",
                  size === "lg" && "h-3 w-3",
                  "animate-bounce"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {variant === "bar" && (
          <div className={cn("w-full bg-muted rounded-full overflow-hidden", size === "sm" && "h-1", size === "md" && "h-2", size === "lg" && "h-3")}>
            <div
              className="h-full bg-primary animate-pulse"
              style={{
                width: "100%",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>
        )}

        {text && (
          <p className="text-sm font-medium text-muted-foreground">{text}</p>
        )}
      </div>
    )
  }
)
Loader.displayName = "Loader"

export { Loader }
