import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavItem {
  label: string
  icon: LucideIcon
  href: string
  isActive?: boolean
  onClick?: () => void
  badge?: number | string
}

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[]
  onItemClick?: (href: string) => void
}

/**
 * Bottom Navigation Bar für Mobile
 * Fixierte Navigation am unteren Bildschirmrand
 * Max 5 Items mit Icon + Label
 *
 * Verwendung:
 * ```tsx
 * const items: BottomNavItem[] = [
 *   { label: 'Schläge', icon: FieldIcon, href: '/fields' },
 *   { label: 'Aufträge', icon: ListIcon, href: '/orders' },
 *   { label: 'Karte', icon: MapIcon, href: '/map' },
 *   { label: 'Personen', icon: UserIcon, href: '/personal' },
 *   { label: 'Einstellungen', icon: SettingsIcon, href: '/settings' }
 * ]
 * <BottomNav items={items} />
 * ```
 */
const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  ({ className, items, onItemClick, ...props }, ref) => {
    if (items.length > 5) {
      console.warn("BottomNav: Maximum 5 items empfohlen. Du hast " + items.length)
    }

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card",
          "supports-[padding:max(0px)]:pb-[max(0.5rem,env(safe-area-inset-bottom))]",
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-around md:hidden">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => {
                  item.onClick?.()
                  onItemClick?.(item.href)
                }}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                  item.isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground active:text-primary"
                )}
                aria-current={item.isActive ? ("page" as const) : undefined}
              >
                <div className="relative">
                  <Icon
                    size={24}
                    className={cn(
                      "transition-all",
                      item.isActive && "text-primary"
                    )}
                    strokeWidth={1.5}
                  />
                  {/* Badge für Benachrichtigungen */}
                  {item.badge && (
                    <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
                      {typeof item.badge === 'number' && item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium">{item.label}</span>

                {/* Aktiver Indikator */}
                {item.isActive && (
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary transition-all" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    )
  }
)
BottomNav.displayName = "BottomNav"

export { BottomNav, type BottomNavItem, type BottomNavProps }
