# Aufgabenliste für MVP

Basierend auf dem Pflichtenheft (Sektion 20), hier ist die empfohlene Reihenfolge der Implementierung für das MVP:

1.  **Authentifizierung & Kontext:** Implementierung von Benutzer-Login, Rollen und dem Kontext für Mandanten (Tenants) und Firmen.
2.  **Datenbank-Abstraktion:** Erstellung der Abstraktionsschicht (Repository-Interfaces) und der Adapter für MySQL und PostgreSQL (Supabase).
3.  **GIS & Flächen:** Umsetzung des Imports von GIS-Daten, der Kartenansicht und der Detailansicht für Schläge.
4.  **Maßnahmen:** Entwicklung des Datenmodells für Maßnahmen und einer schnellen mobilen Erfassungsmaske, die auch mehrere Schläge gleichzeitig unterstützt.
5.  **Arbeitszeiterfassung:** Erfassung der Arbeitszeit pro Maßnahme und Erstellung entsprechender Auswertungen.
6.  **Maschinen & Treibstoff:** Verwaltung der Maschinenstammdaten, Definition von Normverbräuchen und automatische Berechnung des Dieselverbrauchs.
7.  **Wartungsplanung:** Implementierung eines stunden- oder zeitbasierten Wartungsplans mit Benachrichtigungen für fällige Aufgaben und einem Wartungsprotokoll.
8.  **Reparaturerfassung:** Erfassung von Reparaturen inklusive Kosten und Ausfallzeiten.
9.  **Beobachtungen:** Dokumentation von Beobachtungen und Schäden mittels Geopunkten oder Polygonen, inklusive Foto-Upload und Anzeige auf einer Kartenebene.
10. **Ertrag & Erlös:** Funktion zur Erfassung von Ernteerträgen und Verkaufserlösen.
11. **Kostenrechnung & Berichte:** Implementierung der Kostenrechnung und Erstellung von Standardberichten (pro Schlag, pro Kultur, pro Betrieb) mit einer Exportmöglichkeit als CSV-Datei.
12. **Internationalisierung (i18n):** Aufbau der Grundstruktur für die Mehrsprachigkeit, wobei Deutsch als aktive Sprache und Englisch als vorbereiteter Fallback dient.
