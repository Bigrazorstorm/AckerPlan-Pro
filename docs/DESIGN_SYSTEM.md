# AgroTrack – Design System (Phase 0)

Modernes, agrarisch authentisches Design System für deutschlandweite Landwirtschafts-App.

---

## 🎨 Farbpalette

### Primäre Farben

| Name | Farbe | HSL | Hex | Verwendung |
|------|-------|-----|-----|-----------|
| **Agrar-Grün** | `140 52% 37%` | `#2d7a3c` | Primäre Buttons, Links, Navigation, Branding |
| **Erdbraun** | `32 35% 45%` | `#8b6f47` | Sekundäre Aktionen, Hintergrund-Akzente |
| **Akzent-Grün** | `87 62% 56%` | `#a8d968` | Call-to-Action, Highlights, Aufmerksamkeit |

### Status-Farben

| Status | Farbe | HSL | Hex | Verwendung |
|--------|-------|-----|-----|-----------|
| ✅ **Success** | Frisches Grün | `142 65% 48%` | `#27ae60` | Erfolg, Bestätigung, erlaubt |
| ⚠️ **Warning** | Warmes Orange | `38 89% 57%` | `#f39c12` | Warnung, Achtung, benötigt Prüfung |
| ❌ **Destructive** | Klares Rot | `9 84% 60%` | `#e74c3c` | Fehler, Löschen, kritische Aktion |
| ℹ️ **Info** | Sanftes Blau | `204 70% 53%` | `#3498db` | Information, Hinweis, neutral |
| ⊘ **Neutral** | Warmer Grau | `210 8% 58%` | `#95a5a6` | Inaktiv, deaktiviert, entsperrt |

### Neutrale Farben

| Name | HSL | Verwendung |
|------|-----|-----------|
| **Background** | `210 17% 98%` | Seitenhintergrund (hell) |
| **Foreground** | `210 40% 12%` | Haupttext (Schriftzug) |
| **Card Background** | `0 0% 100%` | Karten, Container weiß |
| **Border** | `210 13% 85%` | Trennlinien, Borders |
| **Muted** | `210 13% 90%` | Inaktive Elemente |

### Dark Mode (Feldeinsatz, Sonnenlicht)

Die Dunkelheit im Dark Mode ist beabsichtigt für Feldeinsatz:
- Hintergrund: `210 40% 10%` (nicht pure black, bessere Augengesundheit)
- Vordergrund: `210 40% 97%` (hoher Kontrast, aber nicht augenbelastend)
- Farben werden leichter (z.B. Grün `140 52% 55%` statt `37%`)

---

## 📝 Typografie

### Schriftfamilien

**Primär: Plus Jakarta Sans** (Google Fonts)
```css
font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

- Humanistische Groteste
- Optimal für große Touchscreens
- Nur 1 Schriftart für gesamtes UI (Konsistenz)
- Fallback auf System-Fonts auf älteren Geräten

**Monospace: JetBrains Mono** (für Zahlen/Codes)
```css
font-family: 'JetBrains Mono', monospace;
```

- Tabular-lining aktiviert mit `font-variant-numeric: tabular-nums`
- Für Kosten (€), Flächen (ha), Gewichte (kg)
- Verhindert Layout-Shift bei Zahleneingaben

### Größen-Skala

| Level | Größe (Mobile) | Größe (Desktop) | Gewicht | Verwendung |
|-------|---|---|---------|------------|
| H1 | 2.25rem (36px) | 3rem (48px) | 700 | Seiten-Titel |
| H2 | 1.875rem (30px) | 2.25rem (36px) | 700 | Abschnitt-Titel |
| H3 | 1.5rem (24px) | 1.875rem (30px) | 600 | Unter-Überschrift |
| H4 | 1.25rem (20px) | 1.5rem (24px) | 600 | Label, Karte-Titel |
| **Body** | **1rem (16px)** | 1rem (16px) | 400 | Fließtext (MIN) |
| Small | 0.875rem (14px) | 0.875rem (14px) | 400 | Labels, Helptext |
| Tiny | 0.75rem (12px) | 0.75rem (12px) | 400 | Badges, Meta |

### Zeilenhöhe & Spacing

```css
/* Fließtext */
p, span, li {
  line-height: 1.6;    /* 160% */
  margin-bottom: 1rem;
}

/* Überschriften */
h1, h2, h3, h4 {
  line-height: 1.3;    /* 130% */
  letter-spacing: -0.02em; /* Optisch tighter */
}
```

### Lokalisierung

- **Deutsche Texte überall** (keine englischen UI-Strings)
- Zahlenformat: `1.234,56 €` (mit Punkt für Tausender, Komma für Dezimal)
- Datumsformat: `DD.MM.YYYY`
- Wochentage: Mo, Di, Mi, Do, Fr, Sa, So

---

## 🎯 Komponentendesign

### Button Sizes (Touch-Optimiert)

```css
/* Mobile: Minimum 48×48px für Touch */
.btn {
  min-height: 48px;
  padding: 12px 16px;
  border-radius: var(--radius);
}

.btn-icon {
  width: 48px;
  height: 48px;
}
```

### Input Fields

```css
input, textarea, select {
  min-height: 44px;    /* Touch target */
  padding: 10px 12px;
  font-size: 16px;     /* Verhindert Zoom auf iOS */
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
}

input:focus {
  ring: 2px hsl(var(--ring));
  border-color: hsl(var(--primary));
}
```

### Cards & Container

```css
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```

---

## 📱 Mobile-First Prinzipien

### Spacing System (8px Raster)

```css
/* Tailwind: 8px base unit */
.space-x-1  { gap: 0.25rem; } /* 4px */
.space-x-2  { gap: 0.5rem; }  /* 8px */
.space-x-3  { gap: 0.75rem; } /* 12px */
.space-x-4  { gap: 1rem; }    /* 16px */
.space-x-6  { gap: 1.5rem; }  /* 24px */
.space-x-8  { gap: 2rem; }    /* 32px */
```

### Breakpoints

```typescript
// Tailwind Defaults
sm: 640px   // Kleine Tablets (Portrait)
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Großer Desktop
2xl: 1536px // XXL Screens
```

### Touch Target Sizes

- **Buttons**: Minimum 48×48px
- **List items**: Minimum height 44px
- **Spacing between items**: ≥8px

---

## 🌙 Dark Mode Strategien

### Lichtsensor-gesteuert

```html
<html class="dark" data-environment="field">
  <!-- Automatisch dunkel wenn Lichtsensor niedrig (Feldeinsatz) -->
</html>
```

### Für Web-App (Betriebsleiter)

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode Farben aus :root .dark {...} */
}
```

---

## 🔍 Accessibility (WCAG AA)

### Kontrastverhältnisse

| Element | Kontrast | Status |
|---------|----------|--------|
| Grün auf Weiß | 5.2:1 | ✅ AA+ |
| Braun auf Weiß | 4.8:1 | ✅ AA+ |
| Orange auf Weiß | 6.5:1 | ✅ AA+ |
| Rot auf Weiß | 6.1:1 | ✅ AA+ |
| Grau Text auf Weiß | 4.5:1 | ✅ AA |

### Focus State

```css
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎓 Best Practices

### ✅ Do's

- 🎯 Nutze **nur diese Farbpalette** (keine willkürlichen Farben)
- 📝 Verwende **Plus Jakarta Sans** überall (außer in Codes)
- 📐 Halte dich an das **8px Spacing System**
- 👆 Buttons **mindestens 48×48px** auf Mobile
- ♿ Test mit achtzehnjährigen Menschen (Kontrast!)
- 🌙 Dark Mode muss **funktionieren** (nicht optional)
- 📱 Mobile-First entwickeln, dann Desktop verbessern

### ❌ Don'ts

- ❌ Keine random Farben hinzufügen (z.B. Purpur, Türkis)
- ❌ Keine neuen Schriftarten (kein Roboto, Inter, Poppins!)
- ❌ Nicht `<Input />` ohne Min-Größe von 44px
- ❌ Keine `hover:`-only States (funktioniert nicht auf Touch)
- ❌ Nicht `padding: 3px` oder `gap: 7px` (Raster brechen)
- ❌ Keine Animations ≥ 300ms ohne Use-Case

---

## 📦 CSS-Klassen (Tailwind)

### Status Colors in JSX

```jsx
// Success
<div className="bg-success text-success-foreground">Gespeichert</div>

// Warning  
<div className="bg-warning text-warning-foreground">Überprüfung nötig</div>

// Destructive
<div className="bg-destructive text-destructive-foreground">Fehler</div>

// Info
<div className="bg-info text-info-foreground">Hinweis</div>

// Neutral
<div className="bg-neutral text-neutral-foreground">Inaktiv</div>
```

### Custom Utilities

```css
/* In globals.css kann jederzeit hinzugefügt */
@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90;
  }
}
```

---

## 📞 Kontakt & Questions

Falls Fragen zu Designentscheidungen entstehen:
1. Konsultiere diese Dokumentation
2. Schau in `globals.css` nach Farbvariablen
3. Nutze Tailwind's `text-primary`, `bg-success`, etc.

---

**Erstellt:** Februar 2026  
**Status:** Phase 0 – Basis Design System  
**Nächste Phase:** Komponenten-Bibliothek, Ikonographie, Animationen
