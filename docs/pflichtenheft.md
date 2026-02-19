# Pflichtenheft  
**Projekt:** GIS-gestütztes, Mobile-First Produktions- und Wirtschaftlichkeits-Controlling für Ackerbau (1.700 ha)  
**Version:** 1.1 (Ergänzung: Sprache, Mandanten, DB-Abstraktion)  
**Zielgruppe:** interne Nutzung (Vermarktung optional)  
**Betriebsprofil:** Kulturen u. a. Weizen, Gerste, Dinkel, Triticale, Zuckerrübe, Raps; Fokus auf Fruchtfolge, Bestandsgesundheit, Bodenschutz.

---

## 1. Zielsetzung

### 1.1 Hauptziel
Entwicklung eines Systems zur **integrierten Erfassung, Auswertung und Entscheidungsunterstützung** auf Basis von:
- Schlag-/GIS-Daten
- Produktionsmaßnahmen (Düngung, Pflanzenschutz, Bodenbearbeitung, Saat, Ernte etc.)
- Arbeitszeiten
- Treibstoff
- Maschinen-/Fahrzeugkosten inkl. Wartung und Reparaturen
- Erträgen & Erlösen
- Bestands-/Wachstumsdokumentation inkl. Schäden (mit Foto & Geopunkt/Polygon)

### 1.2 Sprachen (Neu)
- UI-Sprache standardmäßig **Deutsch (de-DE)**.
- Mehrsprachigkeit **vorbereiten** (i18n), mindestens Englisch (en) als zweite Sprache konzeptionell unterstützt.
- Alle UI-Texte **dürfen nicht hardcoded** sein.

---

## 2. Scope & Phasenmodell

### 2.1 MVP (Phase 1: „Transparenz & Nutzung sicherstellen“)
**Muss enthalten:**
- Mobile-First Erfassung von Maßnahmen & Arbeitszeit
- GIS-Schläge anzeigen/auswählen
- Schaden-/Beobachtungsdoku (Punkt/Polygon + Foto)
- Treibstoffkosten erfassen oder automatisch ableiten (über Normverbrauch/Std)
- Maschinenstammdaten, Wartungsplan, Reparaturerfassung
- Auswertungen: Kosten/DB je Schlag & Kultur, Arbeitsstunden, Diesel, Maschinenkosten
- **Mandantenfähigkeit (Tenants) + mehrere Firmen je Tenant** (siehe Kap. 3 & 5)
- **DB-Abstraktion/Adapter**, sodass MySQL oder Supabase (Postgres) nutzbar sind (siehe Kap. 5)

### 2.2 Ausbau (Phase 2: „Fruchtfolge-Logik“)
- Fruchtfolge-Regeln, Vorfruchtwerte, Risiko-/Restriktionslogik
- Mehrjährige Betrachtung / Fruchtfolge-Bewertung

### 2.3 Ausbau (Phase 3: „Entscheidungsunterstützung“)
- Szenarien (Preis, Inputkosten, Intensität)
- Risiko-/Engpassanalysen (Arbeitszeitfenster, Maschinenkapazitäten)
- Optimierungsalgorithmen (optional)

---

## 3. Multi-Tenant & Organisationsmodell (Neu)

### 3.1 Begriffsdefinitionen
- **Tenant**: Mandant / Kunde / Organisationsraum mit klarer Datenisolation.
- **Firma**: Betrieb/Unternehmen innerhalb eines Tenants (z. B. GmbH, GbR, Betriebsteil).
- **Standort** (optional): Betriebsstätte/Region innerhalb einer Firma (kann später kommen).

### 3.2 Muss-Anforderungen
- Die Anwendung muss **mehrere Tenants** unterstützen.
- **Pro Tenant** müssen **mehrere Firmen** verwaltbar sein.
- Nutzer gehören zu **genau einem Tenant** (MVP). (Erweiterung: Nutzer kann mehreren Tenants zugeordnet werden = optional später.)
- Nutzer können berechtigt werden für:
  - mehrere Firmen innerhalb ihres Tenants
  - rollenbasierte Rechte pro Firma (mindestens: lesen/schreiben/auswerten)
- **Strikte Datenisolation**: Nutzer eines Tenants dürfen niemals Daten anderer Tenants sehen (auch nicht indirekt über IDs/Fehlerlogs).

### 3.3 Auswahlkonzept (UI)
- Nach Login: Auswahl bzw. zuletzt genutzte **Firma** (und optional Jahr) wird geladen.
- Wechsel der Firma ist jederzeit möglich (z. B. über Header-Menü).

---

## 4. Benutzerrollen & Rechte

### 4.1 Rollen (tenant- und firmenbezogen)
- **Tenant Admin**: verwaltet Tenant, Firmen, Benutzer, globale Einstellungen, DB/Integrationen
- **Firmen Admin**: verwaltet Stammdaten/Preise innerhalb der Firma
- **Betriebsleitung/Controlling**: Auswertung, Freigaben, Kalkulation, Reports
- **Mitarbeiter/Fahrer**: mobile Erfassung von Maßnahmen/Zeiten/Verbräuchen, Schäden
- **Werkstatt/Technik**: Wartung/Reparatur erfassen, Plan pflegen
- **Leser**: nur Auswertung / keine Eingabe

### 4.2 Rechtekonzept (Muss)
- Rollenbasierte Zugriffssteuerung pro Modul und pro Firma:
  - Stammdaten (lesen/schreiben)
  - Maßnahmen (erfassen/bearbeiten/freigeben)
  - Maschinen/Wartung (erfassen/bearbeiten)
  - Finanzen/Kosten (nur Controlling/Admin)
  - Export/Import (nur Admin/Controlling)

---

## 5. Datenbank-Anbindung & Architektur (Neu / Muss)

### 5.1 Ziel
Die App muss so entworfen werden, dass **unterschiedliche Datenbanken** angebunden werden können, ohne Business-Logik anzupassen. Mindestens:
- **MySQL** (z. B. MariaDB/MySQL)
- **Supabase** (PostgreSQL + Auth/Storage optional)

### 5.2 Architektur-Anforderungen (Muss)
- Einführung einer **Datenzugriffsschicht** (Repository/DAO) mit klaren Interfaces, z. B.:
  - `FieldRepository`, `OperationRepository`, `MachineRepository`, ...
- Business-Logik darf **keine DB-spezifischen Queries** enthalten.
- DB-spezifische Implementierungen als **Adapter**:
  - Adapter A: MySQL
  - Adapter B: Postgres/Supabase
- Migrationsstrategie:
  - Schema wird über Migrationsframework verwaltet (DB-unabhängig soweit möglich).
- Alle Primärschlüssel als **UUID** (empfohlen), um Cross-DB/Sync zu erleichtern.
- Zeitstempel standardisiert: `created_at`, `updated_at`, optional `deleted_at` (Soft-Delete).

### 5.3 Tenant-/Firmen-Scope in DB (Muss)
Alle fachlichen Tabellen müssen Tenant- und Firmenbezug abbilden:
- `tenant_id` (Pflicht)
- `company_id` (Pflicht, außer bei reinen Tenant-Settings)
- Indizes: `(tenant_id, company_id, ...)` auf allen Hauptabfragen
- Row-Level Isolation:
  - In Business-Schicht: jede Query **immer** tenant/company scoping
  - Optional (Supabase): Row Level Security Policies (später/optional, aber vorbereiten)

### 5.4 Mehrere Datenbanken anbinden (Muss)
Die Anwendung muss folgende Modi unterstützen:
- **Single-DB / Multi-Tenant**: alle Tenants in einer DB (tenant_id-Spalte)
- **DB-per-Tenant** (optional aber vorbereitet): Tenant hat eigene DB-Verbindung (z. B. großer Kunde)
  - Tenant-Konfiguration speichert DB-Connection-Parameter (verschlüsselt)
  - Verbindungs-Auswahl anhand tenant_id beim Request

> MVP-Anforderung: mindestens Single-DB / Multi-Tenant lauffähig.  
> Vorbereitung: DB-per-Tenant Architektur sauber möglich (kein Redesign nötig).

### 5.5 Storage (Fotos/Belege)
- Foto-/Dateiablage muss ebenfalls tenant/company scoping unterstützen.
- Supabase Storage kann optional genutzt werden, aber nicht zwingend.
- Abstraktion analog DB: `StorageProvider` Interface (z. B. Local/S3/Supabase).

---

## 6. Internationalisierung (i18n) – Detailanforderungen (Neu)

### 6.1 Muss
- Texte/Labels/Fehlermeldungen über i18n-Key-Value (z. B. JSON-Locales).
- Datums-/Zahlenformat abhängig von Locale:
  - Deutsch: `dd.mm.yyyy`, Dezimalkomma
  - Englisch: `mm/dd/yyyy` oder `yyyy-mm-dd` (festlegen), Dezimalpunkt
- Einheiten: ha, t, kg, l – bleiben i. d. R. gleich, aber Formatierung muss sauber sein.

### 6.2 Soll
- Benutzer kann Sprache pro Profil wählen.
- Default: Deutsch (de-DE), Fallback: Englisch.

---

## 7. Systemanforderungen (Non-Functional)

### 7.1 Mobile First
- Primär: Smartphone (Android/iOS), sekundär: Tablet, Desktop für Auswertung.
- Eingabe muss **max. 15–20 Sekunden** je Standardmaßnahme ermöglichen.
- **Offline-Fähigkeit**: Erfassung ohne Netz; Sync bei Verbindung.
- Sync muss Tenant/Firma berücksichtigen (keine Vermischung).

### 7.2 Performance
- Kartendarstellung muss auf Mobilgeräten flüssig sein.
- Laden der Schlagkarte < 3 Sekunden (Zielwert).

### 7.3 Datensicherheit & Audit
- Benutzer-Login, sichere Sessions, Passwortregeln
- Audit-Trail für Kostenpreise, Maßnahmen, Reparaturen
- Backups (täglich)
- Mandantenisolierung auch in Logs/Monitoring (keine sensiblen Daten in Logs)

---

## 8. Stammdaten (Muss)

### 8.1 Schläge (firmenbezogen)
- ID, Name, Geometrie (Polygon), Fläche
- Bodenpunkte/Bodenart (optional)
- Restriktionen (Flags)

### 8.2 Kulturen (firmenbezogen)
- Kulturartenliste, Sorten (optional), Fruchtfolgeklasse

### 8.3 Betriebsmittel & Preise (firmenbezogen)
- Saatgut, Dünger, Pflanzenschutz, Dieselpreis, Lohnsätze

### 8.4 Maschinen/Fahrzeuge (firmenbezogen)
- Traktoren, Geräte, Mähdrescher, Transportfahrzeuge etc.

---

## 9. Produktionsdokumentation (Mobile) – Maßnahmen
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 10. Wachstums-/Bestands- und Schadensdokumentation
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 11. Arbeitszeitmodul
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 12. Treibstoffmodul
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 13. Maschinen-/Fahrzeugmodul inkl. Wartung/Reparaturen
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 14. Kostenrechnung & Wirtschaftlichkeit
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 15. UI-Screens (Ergänzung)

### 15.1 Login & Kontext
- Login
- Firma wählen (wenn Nutzer mehrere Firmenrechte hat)
- Spracheinstellung (optional im Profil)

### 15.2 Admin
- Tenant-Verwaltung (Tenant Admin)
- Firmenverwaltung innerhalb Tenant (Firmendaten, Standardwährung, Defaults)
- Benutzerverwaltung + Rollen + Firmen-Zuordnung
- Datenbank/Integrationseinstellungen (sofern DB-per-Tenant oder externe Systeme)

---

## 16. Datenmodell (konzeptuell, erweitert um Tenant/Firma)

### 16.1 Kern-Entitäten (Neu)
- `Tenant`
- `Company` (Firma)
- `User`
- `UserCompanyRole` (Zuordnung: Nutzer ↔ Firma ↔ Rolle)

### 16.2 Fach-Entitäten (wie zuvor, jeweils mit tenant_id & company_id)
- Field, CropYear, Operation, OperationInput, LaborEntry, Machine, MachineUsage,
  MaintenancePlan, MaintenanceEvent, RepairEvent, ObservationDamage, YieldRecord

### 16.3 Beziehungen
- Tenant 1..n Company
- Company 1..n Field/Machine/Products/Operations/...
- User 1..1 Tenant
- User n..m Company (über UserCompanyRole)

---

## 17. Import/Export
(bleibt wie Version 1.0, zusätzlich gilt überall Tenant/Firma-Scoping)

---

## 18. Akzeptanzkriterien (MVP) – erweitert

1. Maßnahmen offline erfassbar (pro Firma).
2. Maßnahme in < 20 Sekunden speicherbar (Standardfall).
3. Diesel wird automatisch berechnet.
4. Arbeitszeit in Auswertung sichtbar.
5. Wartungen werden automatisch als fällig angezeigt.
6. Reparaturen inkl. Kosten und Stillstand erfassbar.
7. Deckungsbeitrag je Schlag berechenbar.
8. **Mehrere Tenants** sind anlegbar; Daten sind strikt isoliert.
9. Pro Tenant sind **mehrere Firmen** anlegbar; Nutzer können Firmenrechte haben.
10. Die App kann mit **mindestens zwei DB-Backends** betrieben werden (MySQL und Postgres/Supabase), ohne Änderung der Business-Logik (nur Adapter-Konfiguration).

---

## 19. Offene Entscheidungen (ergänzt)
- Fixkostenmodell (Detailtiefe)
- Tankkontenmodell optional
- Sync-Konfliktregel
- DB-Betriebsmodus: Single-DB Multi-Tenant vs. DB-per-Tenant (MVP: Single-DB; Vorbereitung: DB-per-Tenant möglich)
- Supabase Auth/Storage nutzen oder eigenes Auth/Storage (MVP kann eigenes Auth sein; Vorbereitung: Provider-Interfaces)

---

## 20. Empfohlene MVP-Schnittliste (aktualisiert)

1) Auth + Rollen + Tenant/Firma-Kontext  
2) DB-Abstraktionslayer (Repository Interfaces + Adapter MySQL/Postgres)  
3) GIS-Import, Kartenansicht, Schlagdetail  
4) Maßnahmenmodell + Schnellerfassung mobil + Multi-Schlag  
5) Arbeitszeit je Maßnahme + Auswertung  
6) Maschinenstamm + Normverbrauch Diesel + Dieselberechnung  
7) Wartungsplan (stunden-/zeitbasiert) + fällige Tasks + Wartungslog  
8) Reparaturerfassung + Kosten + Stillstand  
9) Beobachtung/Schaden: Punkt/Polygon + Foto + Layer  
10) Ertrag/Erlös erfassen  
11) Kostenrechnung + Standardberichte (Schlag/Kultur/Betrieb) + CSV Export  
12) i18n Grundgerüst (Deutsch aktiv, Englisch als Fallback vorbereitet)
