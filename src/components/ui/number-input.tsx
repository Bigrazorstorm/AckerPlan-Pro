import * as React from "react"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  unit?: string
  min?: number
  max?: number
  step?: number
}

/**
 * Number Input Komponente speziell für Agrar-Werte
 * Mit Unit-Suffix (ha, €, kg, etc.)
 *
 * Verwendet JetBrains Mono mit tabular-nums für stabile Layout
 *
 * Verwendung:
 * ```tsx
 * <NumberInput unit="ha" placeholder="Fläche" />
 * <NumberInput unit="€" placeholder="Kosten" />
 * <NumberInput unit="kg" placeholder="Gewicht" />
 * ```
 */
const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  ({ className, unit, min, max, step = 0.1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative inline-flex w-full items-center rounded-md border border-input bg-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
      >
        <input
          type="number"
          inputMode={"numeric" as const}
          min={min}
          max={max}
          step={step}
          className={cn(
            "flex min-h-12 w-full rounded-l-md border-0 bg-input px-3 py-2 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10 md:text-sm",
            "font-tabular", // JetBrains Mono mit tabular-nums
            unit && "pr-1" // Platz für Unit
          )}
          {...props}
        />

        {unit && (
          <span className="pointer-events-none flex items-center justify-center whitespace-nowrap px-3 py-2 font-tabular text-sm font-medium text-muted-foreground md:text-xs">
            {unit}
          </span>
        )}
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
