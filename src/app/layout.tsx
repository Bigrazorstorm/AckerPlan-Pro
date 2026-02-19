import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export const metadata: Metadata = {
  title: {
    default: 'FieldSense Agro',
    template: `%s | FieldSense Agro`,
  },
  description: 'GIS-gestütztes, Mobile-First Produktions- und Wirtschaftlichkeits-Controlling für Ackerbau',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
            <Sidebar>
              <SidebarNav />
            </Sidebar>
            <div className="flex flex-col w-full">
              <Header />
              <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
