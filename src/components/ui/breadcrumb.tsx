'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
}

/**
 * Breadcrumb Navigation
 * Zeigt dem Nutzer wo er sich im System befindet
 *
 * Wird automatisch aus der URL generiert, oder manuell konfiguriert
 *
 * Verwendung:
 * ```tsx
 * <Breadcrumb items={[
 *   { label: 'Dashboard', href: '/' },
 *   { label: 'Schläge', href: '/fields' },
 *   { label: 'Mühlfeld Ost', isCurrentPage: true }
 * ]} />
 * ```
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

    React.useEffect(() => {
      // Nutze übermittelte Items oder generiere aus Path
      if (items) {
        setBreadcrumbs(items);
      } else {
        // Automatische Erstellung aus pathname
        const segments = pathname
          .split('/')
          .filter(s => s && s !== 'de' && s !== 'en'); // Locale raus

        const auto: BreadcrumbItem[] = [
          { label: 'Dashboard', href: '/' },
        ];

        segments.forEach((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);
          auto.push({
            label,
            href,
            isCurrentPage: index === segments.length - 1,
          });
        });

        setBreadcrumbs(auto);
      }
    }, [pathname, items]);

    // Keine Breadcrumb bei Homepage
    if (breadcrumbs.length <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn(
          'mb-4 flex items-center gap-2 text-sm md:mb-6',
          className
        )}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center gap-1">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={`${item.href}-${index}`}>
              {index > 0 && (
                <li className="text-muted-foreground">
                  <ChevronRight size={16} />
                </li>
              )}
              <li>
                {item.href && !item.isCurrentPage ? (
                  <Link
                    href={item.href}
                    className="text-primary hover:underline transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'transition-colors',
                      item.isCurrentPage
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps }
