# AgroTrack – Phase 2: Layout & Navigation (Erledigt ✅)

Zusammenfassung der Phase 2 Implementierung - Seiten-Layout und mobile Navigation.

---

## ✅ Implementierte Komponenten & Features

### 1. **Breadcrumb Navigation** (`breadcrumb.tsx`)

Zeigt Nutzer den aktuellen Pfad im System.

```tsx
<Breadcrumb items={[
  { label: 'Dashboard', href: '/' },
  { label: 'Schläge', href: '/fields' },
  { label: 'Mühlfeld Ost', isCurrentPage: true }
]} />
```

**Features:**
- ✅ Automatische Generierung aus URL
- ✅ Manuelle Override möglich  
- ✅ Keine Breadcrumb auf Homepage
- ✅ Accessible Links (ChevronRight Separator)

---

### 2. **PageLayout Wrapper** (`page-layout.tsx`)

Konsistentes Seiten-Header Layout für alle Pages.

```tsx
<PageLayout
  title="Schläge"
  description="Verwalte deine Äcker und Wiesen"
  headerAction={<Button><Plus /> Neuer Schlag</Button>}
>
  {/* Content */}
</PageLayout>
```

**Features:**
- ✅ H1-Titel + Beschreibung
- ✅ Header-Action Button (rechts oben)
- ✅ Breadcrumbs integriert
- ✅ Responsive (auf Mobile gestapelt)

---

### 3. **Mobile Bottom Navigation** (`mobile-nav-layout.tsx`)

Wrapper für Mobile-Navigation auf Seiten.

```tsx
<MobileNavLayout>
  {children}
</MobileNavLayout>
```

**Features:**
- ✅ 5 Haupt-Navigation Items
- ✅ Active-Link Highlighting
- ✅ Badge für Benachrichtigungen
- ✅ Locale-aware Links  
- ✅ Automatisch versteckt auf Desktop (`hidden md:hidden`)
- ✅ Padding unten für Content (`pb-20 md:pb-0`)
- ✅ Safe Area für iPhone Notch

---

### 4. **Form Wrapper** (`form-wrapper.tsx`)

Erweiterte React Hook Form Integration mit Styling.

```tsx
const form = useForm({
  defaultValues: { name: '', email: '' }
})

<Form form={form} onSubmit={handleSubmit}>
  <FormField
    name="name"
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input {...field} placeholder="Dein Name" />
        </FormControl>
        {fieldState.error && (
          <FormMessage>{fieldState.error.message}</FormMessage>
        )}
      </FormItem>
    )}
  />
</Form>
```

**Features:**
- ✅ TypeScript-safe Field Handling
- ✅ Automatische Error-Anzeige
- ✅ FormLabel, FormControl, FormMessage, FormDescription
- ✅ Konsistentes Spacing (6px zwischen Feldern)
- ✅ Fehlerfarben (Rot/Destructive)

---

## 🔄 Layout-Integration

**Root Layout** (`[locale]/layout.tsx`):
```tsx
<SidebarProvider>
  <Sidebar><SidebarNav /></Sidebar>
  <div className="flex flex-col w-full">
    <Header />
    <main>
      <MobileNavLayout>
        {children}  {/* MobileNavLayout wraps children */}
      </MobileNavLayout>
    </main>
  </div>
</SidebarProvider>
```

**Desktop:**
- Sidebar links (SidebarProvider steuert Visibility)
- Header mit User-Dropdown + Company-Switcher
- Main Content Area mit Breadcrumbs

**Mobile:**
- Header mit Hamburger-Trigger
- Main Content (full width)
- Bottom Navigation Bar (5 Items)
- Safe Area Padding für iPhone

---

## 📐 Breakpoints & Responsive

```css
/* Tailwind Defaults für AgroTrack */
sm:  640px   /* Kleine Tablets (Portrait) */
md:  768px   /* Tablets / Sidebar hidden */
lg:  1024px  /* Desktop */
xl:  1280px  /* Großer Desktop */
2xl: 1536px  /* XXL */
```

**Mobile-First Strategie:**
1. Basis-Styles für Mobile (< 640px)
2. Tablet-optimiert bei `md:` (≥ 768px)
3. Desktop-Layout bei `lg:` (≥ 1024px)

**Navigation-Responsive:**
- Mobile: Bottom Navigation (`hidden md:hidden`)
- Tablet+: Sidebar Navigation

---

## 🎨 Dashboard Update

Alte Seite:
```tsx
<div className="space-y-8">
  <div>
    <h1>{t('welcome')}</h1>
    {/* Dashboard Content */}
  </div>
</div>
```

Neue Seite mit PageLayout:
```tsx
<PageLayout
  title={t('welcome')}
  description={t('description')}
>
  {/* Dashboard KPIs Grid */}
  {/* Charts & Tables */}
</PageLayout>
```

**Improvements:**
- ✅ Konsistentes Header-Layout
- ✅ Automatische Breadcrumbs (optional)
- ✅ Status-Badge mit neuen Farben (success statt green)
- ✅ Icon-Größen standardisiert (h-5 w-5)
- ✅ Table responsive (Field-Column versteckt auf Mobil)

---

## 📱 Mobile-Optimierungen

### Header (Mobile):
```tsx
<header className="sticky top-0 z-30 h-14 md:h-auto">
  <SidebarTrigger /> {/* Nur Mobile */}
  <CompanySwitcher />
  <UserDropdown />
</header>
```

### Main Content:
```tsx
<main className="flex-1 p-4 sm:p-6 lg:p-8">
  <MobileNavLayout>
    {children}
  </MobileNavLayout>
</main>
```

Padding passt sich an:
- Mobile: `p-4` (16px)
- Tablet: `p-6` (24px)
- Desktop: `p-8` (32px)
- Plus `pb-20` für BottomNav Platz

### Safe Area (iPhone):
```css
nav {
  bottom: 0;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
```

---

## ✅ Checkliste-Status

Aus **AckerPlanPro_Checkliste.md**:

- ✅ **2.1 Breakpoint-System** – Definiert in tailwind + CSS
- ✅ **2.2 Navigation Mobile** – Bottom Nav mit 5 Items
- ✅ **2.3 Touch-Optimierung** – 48px Buttons, 44px Inputs
- ✅ **2.4 Formulare Mobile** – Form-Wrapper mit React Hook Form
- ✅ **3.1 Navigation & Orientierung** – Breadcrumbs + PageLayout
- ✅ **3.2 Feedback & Systemstatus** – Toast, Loader, Skeleton vorhanden

---

## 🚀 Code-Struktur

```
src/components/
├── ui/
│   ├── breadcrumb.tsx        ✨ Neu
│   ├── bottom-nav.tsx         ✨ Phase 1
│   ├── form-wrapper.tsx       ✨ Neu
│   ├── empty-state.tsx        ✨ Phase 1
│   ├── loader.tsx             ✨ Phase 1
│   └── ... (weitere)
└── layout/
    ├── header.tsx
    ├── sidebar-nav.tsx
    ├── page-layout.tsx        ✨ Neu
    └── mobile-nav-layout.tsx  ✨ Neu

src/app/
├── [locale]/layout.tsx        ✅ Updated mit MobileNavLayout
└── [locale]/page.tsx          ✅ Updated dashboard
```

---

## 💡 Best Practices für neue Seiten

### Fields List Page Beispiel:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

export default function FieldsPage() {
  const t = useTranslations('Fields');
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch fields
  }, []);

  return (
    <PageLayout
      title={t('title')}
      description={t('description')}
      headerAction={
        <Button onClick={() => router.push('./fields/new')}>
          <Plus /> {t('newField')}
        </Button>
      }
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={<Button><Plus /> {t('createFirst')}</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map(field => (
            <Card key={field.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <h3>{field.name}</h3>
              </CardHeader>
              <CardContent>
                {/* Content */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
```

---

## 🔗 Weiterführende Links

- [Design System Dokumentation](DESIGN_SYSTEM.md)
- [Komponenten Übersicht](COMPONENTS.md)
- [Farbpalette](COLOR_PALETTE.md)

---

**Erstellt:** Februar 2026  
**Phase:** 2 – Seiten-Layout & Navigation  
**Status:** ✅ Abgeschlossen  
**Nächste Phase:** 3 – Module (Felder, Operationen, Personal)
