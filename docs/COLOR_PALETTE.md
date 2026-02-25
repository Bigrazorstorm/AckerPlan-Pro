# AgroTrack – Farbpalette Quick Reference

Schnelle Referenz für Entwickler und Designer.

## 🎨 Kern-Farben

```
Primär (Buttons, Links)       → Agrar-Grün      #2d7a3c
Sekundär (Nebenfunktionen)    → Erdbraun        #8b6f47  
Akzent (Call-to-Action)       → Akzent-Grün     #a8d968
```

## 📊 Status-Farben

```
✅ Erfolg/Aktiv   → Frisches Grün      #27ae60
⚠️ Warnung        → Warmes Orange      #f39c12
❌ Fehler/Kritik  → Klares Rot         #e74c3c
ℹ️ Information     → Sanftes Blau       #3498db
⊘ Inaktiv        → Warmer Grau        #95a5a6
```

## 💻 Tailwind CSS Klassen

```jsx
// Primäre Aktion
<button className="bg-primary text-primary-foreground">
  Speichern
</button>

// Status anzeigen
<div className="bg-success text-success-foreground">✅ Gespeichert</div>
<div className="bg-warning text-warning-foreground">⚠️ Warnung</div>
<div className="bg-destructive text-destructive-foreground">❌ Fehler</div>
<div className="bg-info text-info-foreground">ℹ️ Info</div>
```

## 📝 Schriftarten

```css
/* Body & Headlines */
font-family: 'Plus Jakarta Sans', system-ui, sans-serif;

/* Zahlen (Kosten, Flächen) */
font-family: 'JetBrains Mono', monospace;
font-variant-numeric: tabular-nums;
```

---

**Vollständige Dokumentation:** [`docs/DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
