# AgroTrack – Komponenten-Bibliothek (Phase 1)

Übersicht aller UI-Komponenten und Best Practices für AgroTrack.

---

## 📦 Verfügbare Komponenten

### Layout & Container

| Komponente | Datei | Beschreibung |
|------------|-------|-------------|
| **Card** | `card.tsx` | Container für Inhalte (Schläge, Aufträge, etc.) |
| **Separator** | `separator.tsx` | Visuelle Trennlinie |
| **Sheet** | `sheet.tsx` | Seitenblatt für Mobile (Drawer) |
| **Dialog** | `dialog.tsx` | Modal für Desktop / Bottom Sheet für Mobile |
| **Scrollarea** | `scroll-area.tsx` | Scrollbarer Bereich mit Custom-Scrollbar |

### Eingabe-Elemente

| Komponente | Datei | Verwendung |
|------------|-------|-----------|
| **Input** | `input.tsx` | Text-Input (48px Mobile, optimiert) |
| **NumberInput** | `number-input.tsx` | Zahleingabe mit Unit (€, ha, kg) |
| **Textarea** | `textarea.tsx` | Mehrzeiliger Text |
| **Checkbox** | `checkbox.tsx` | Ja/Nein Auswahl |
| **Radio Group** | `radio-group.tsx` | Einer von Mehreren |
| **Switch** | `switch.tsx` | Toggle (Ein/Aus) |
| **Select** | `select.tsx` | Dropdown-Auswahl |
| **Slider** | `slider.tsx` | Range-Eingabe |
| **Calendar** | `calendar.tsx` | Datepicker |

### Buttons & Aktionen

| Komponente | Datei | Beschreibung |
|------------|-------|-------------|
| **Button** | `button.tsx` | Aktion-Button (48px Mobile, 5 Varianten) |
| **DropdownMenu** | `dropdown-menu.tsx` | Kontext-Menü |
| **Menubar** | `menubar.tsx` | Menüleiste (Desktop) |

### Navigation

| Komponente | Datei | Beschreibung |
|------------|-------|-------------|
| **BottomNav** | `bottom-nav.tsx` | Mobile Bottom Navigation (max 5 Items) |
| **Sidebar** | `sidebar.tsx` | Desktop-Sidebar |
| **Tabs** | `tabs.tsx` | Tab-Navigation |

### Feedback & Status

| Komponente | Datei | Verwendung |
|------------|-------|-----------|
| **Toast** | `toast.tsx` + `toaster.tsx` | Benachrichtigungen (oben/unten) |
| **Alert** | `alert.tsx` | Static Warnung/Info |
| **AlertDialog** | `alert-dialog.tsx` | Bestätigungsdialog |
| **StatusBadge** | `status-badge.tsx` | Success/Warning/Error Badge |
| **Badge** | `badge.tsx` | Kleine Label |
| **Progress** | `progress.tsx` | Fortschrittsbalken |
| **Skeleton** | `skeleton.tsx` | Loading Placeholder |
| **Loader** | `loader.tsx` | Lade-Animation (Spinner/Dots/Bar) |

### Sonstige

| Komponente | Datei | Beschreibung |
|------------|-------|-------------|
| **Avatar** | `avatar.tsx` | Profilbild + Fallback |
| **Collapsible** | `collapsible.tsx` | Ausklappbarer Bereich |
| **Accordion** | `accordion.tsx` | Tab-Akkordeon |
| **Carousel** | `carousel.tsx` | Bildkarussell |
| **Chart** | `chart.tsx` | Diagramme (Recharts) |
| **Form** | `form.tsx` | React Hook Form Integration |
| **Label** | `label.tsx` | Beschriftung für Inputs |
| **Popover** | `popover.tsx` | Schwebendes Popup |
| **Tooltip** | `tooltip.tsx` | Hover-Hinweis |
| **Table** | `table.tsx` | HTML-Tabelle |
| **EmptyState** | `empty-state.tsx` | Leere Liste mit Icon |

---

## 🎨 Komponenten-Best-Practices

### Größen & Touch

```tsx
// ✅ Buttons: Mindestens 48×48px auf Mobile
<Button className="min-h-12 md:min-h-10">
  Speichern
</Button>

// ✅ Inputs: 44px Mindesthöhe
<Input className="min-h-11" />

// ✅ Touch-Targets mit Abstand (8px Minimum)
<div className="flex gap-2">
  <Button>Aktion 1</Button>
  <Button>Aktion 2</Button>
</div>
```

### Farben & Status

```tsx
import { StatusBadge } from "@/components/ui/status-badge"

// Success
<StatusBadge variant="success">Aktiv</StatusBadge>

// Warning
<StatusBadge variant="warning">Überprüfung nötig</StatusBadge>

// Error
<StatusBadge variant="destructive">Fehler</StatusBadge>

// Info
<StatusBadge variant="info">Information</StatusBadge>
```

### Icons verwenden

```tsx
import { Leaf, Plus, Cloud } from "@/components/ui/icons"
import { ICON_SIZES } from "@/components/ui/icons"

// Icon in Button
<Button>
  <Plus size={ICON_SIZES.sm} />
  Neuer Schlag
</Button>

// Standalone Icon
<Leaf size={ICON_SIZES.lg} strokeWidth={1.5} />

// Mit Label unter Icon
<div className="flex flex-col items-center gap-2">
  <Cloud size={32} className="text-info" />
  <span className="text-sm">Wetter</span>
</div>
```

### Animationen

```tsx
// Fade In
<div className="animate-fade-in">Inhalte mit Animation</div>

// Slide Up (Modal)
<div className="animate-slide-up">Modal öffnet von unten</div>

// Loader mit Animation
<Loader variant="spinner" text="Lädt..." />

// Pulse für Loading-State
<div className="animate-pulse-soft bg-primary/20 rounded-md h-8 w-full" />
```

### Lists & Pagination

```tsx
// ✅ Virtualisiert laden (nur sichtbare Items)
import { List } from "react-virtualized"

// ✅ Scroll-Sticky Header
<div className="sticky top-0 bg-background z-10 border-b">
  <h2>Schläge</h2>
</div>

// ✅ Pull-to-Refresh
// Wird in mobilen Apps implementiert
```

### Formulare

```tsx
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"

const MyForm = () => {
  const form = useForm()
  
  return (
    <Form {...form}>
      <form>
        {/* Inputs */}
        <Button type="submit">Speichern</Button>
      </form>
    </Form>
  )
}
```

---

## 🚀 Neue Komponenten in Phase 1

### 1. **EmptyState** (`empty-state.tsx`)

```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Leaf, Plus } from "@/components/ui/icons"

<EmptyState
  icon={Leaf}
  title="Keine Schläge vorhanden"
  description="Erstelle einen neuen Schlag um zu starten"
  action={<Button><Plus />Neuer Schlag</Button>}
/>
```

### 2. **BottomNav** (`bottom-nav.tsx`)

```tsx
import { BottomNav, type BottomNavItem } from "@/components/ui/bottom-nav"
import * as Icons from "@/components/ui/icons"

const items: BottomNavItem[] = [
  { label: "Schläge", icon: Icons.Leaf, href: "/fields" },
  { label: "Aufträge", icon: Icons.TrendingUp, href: "/operations" },
  { label: "Karte", icon: Icons.Map, href: "/map" },
  { label: "Personen", icon: Icons.Users, href: "/personal" },
  { label: "Einstellungen", icon: Icons.Settings, href: "/settings" }
]

<BottomNav items={items} />
```

### 3. **NumberInput** (`number-input.tsx`)

```tsx
import { NumberInput } from "@/components/ui/number-input"

// Fläche in Hektar
<NumberInput unit="ha" placeholder="Fläche" />

// Kosten in Euro
<NumberInput unit="€" placeholder="Kosten" step={0.01} />

// Gewicht in kg
<NumberInput unit="kg" placeholder="Gewicht" />
```

### 4. **Loader** (`loader.tsx`)

```tsx
import { Loader } from "@/components/ui/loader"

<Loader /> {/* Default Spinner */}
<Loader variant="dots" text="Lädt..." />
<Loader variant="bar" size="lg" />
```

### 5. **StatusBadge** (`status-badge.tsx`)

```tsx
import { StatusBadge } from "@/components/ui/status-badge"

<StatusBadge variant="success">Aktiv</StatusBadge>
<StatusBadge variant="warning">Überprüfung</StatusBadge>
<StatusBadge variant="destructive">Fehler</StatusBadge>
```

---

## 📱 Mobile Optimierungen

### Tap-freundliche Größen

```css
/* Standard Touch Target Größen */
.tap-target {
  min-height: 48px;  /* Mobil */
  min-width: 48px;
  min-height: 44px;  /* iOS Safari Standard */
}

@media (min-width: 768px) {
  .tap-target {
    min-height: 40px;  /* Desktop kompakter */
  }
}
```

### Safe Area für iPhone Notch

```tsx
<nav className="fixed bottom-0 left-0 right-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
  {/* Bottom Navigation */}
</nav>
```

### Native Inputs

```tsx
// Datapicker: Native auf Mobile
<input type="date" className="native-date-picker" />

// Zahlen: Numerisches Keyboard
<input type="number" inputMode="decimal" />

// Telefon: Telefon-Keyboard
<input type="tel" inputMode="tel" />
```

---

## 🎯 Icon-Verwendung

### Größen Standardisieren

```tsx
import { ICON_SIZES } from "@/components/ui/icons"

// xs: 16px (Inline-Badges)
// sm: 20px (Standard Inline)
// md: 24px (Navigation)
// lg: 32px (Featured)
// xl: 48px (Hero)

<Icon size={ICON_SIZES.md} strokeWidth={1.5} />
```

### Agrarische Icons katalogisieren

```typescript
// `icons.ts` enthält:
export const AGRO_ICONS = {
  fields: "Leaf",           // Schläge
  operations: "TrendingUp", // Operationen
  map: "Map",               // Karte
  machinery: "Wrench",      // Maschinen
  weather: "Cloud",         // Wetter
  damage: "AlertTriangle",  // Wildschaden
  // ... weitere
}
```

---

## ✅ Komponenten-Checkliste (Phase 1)

- ✅ Button (Größen, Varianten, Touch optimiert)
- ✅ Input (Min-Height 44px, mobil-freundlich)
- ✅ Card (für Listen-Items)
- ✅ Toast (Benachrichtigungen)
- ✅ Skeleton (Loading)
- ✅ Dialog/Modal
- ✅ Badge & StatusBadge
- ✅ EmptyState (Neu)
- ✅ BottomNav (Neu, mobil)
- ✅ NumberInput (Neu, mit Units)
- ✅ Loader (Neu, 3 Varianten)
- ✅ Icon Library (Neu, mit Agro-Namen)
- ✅ Animationen (Fade, Slide, Bounce, etc.)

---

## 🔄 Nächste Schritte (Phase 2)

- **Landwirtschafts-spezifische Icons** (Custom SVGs)
- **Map-Komponente** (mit Leaflet)
- **Datenvisualisierung** (Recharts Wrapper)
- **Formular-Komponenten** (mit Validierung)
- **Dashboard-Layout** (Responsive Grid)

---

**Erstellt:** Februar 2026  
**Status:** Phase 1 – UI-Komponenten  
**Nächste Phase:** Phase 2 – Spezial-Komponenten
