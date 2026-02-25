'use client';

import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerAction?: React.ReactNode;
}

/**
 * Page Layout Wrapper
 * Bietet konsistentes Header-Layout mit Title, Description, Breadcrumbs
 *
 * Verwendung auf Seiten:
 * ```tsx
 * <PageLayout
 *   title="Schläge"
 *   description="Verwalte deine Acker und Wiesen"
 *   headerAction={<Button><Plus /> Neuer Schlag</Button>}
 * >
 *   <div className="grid gap-4">
 *     <div>Inhalt</div>
 *   </div>
 * </PageLayout>
 * ```
 */
const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, title, description, breadcrumbs, headerAction, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4 md:space-y-6', className)} {...props}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} />

        {/* Page Header */}
        {title && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground md:text-lg">{description}</p>
              )}
            </div>

            {/* Header Action (Button) */}
            {headerAction && (
              <div className="flex gap-2">
                {headerAction}
              </div>
            )}
          </div>
        )}

        {/* Page Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    );
  }
);
PageLayout.displayName = 'PageLayout';

export { PageLayout, type PageLayoutProps }
