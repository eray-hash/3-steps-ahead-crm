import type { Bereich } from '../types'

// Alle 7 Bereiche inkl. Immobilien (das in KUNDEN_BEREICHE bewusst fehlt, da es Objekte statt
// Kunden führt, siehe kundenBereiche.ts) — für Stellen, die wirklich alle Bereiche brauchen, z.B.
// die Zugriffs-Checkliste in der Mitarbeiter-Verwaltung und die rollenbasierte Routen-Absicherung.
export const ALLE_BEREICHE: { id: Bereich; label: string }[] = [
  { id: 'beratung', label: 'Patente' },
  { id: 'immobilien', label: 'Immobilien- & Mietrecht' },
  { id: 'erben', label: 'Marken' },
  { id: 'betriebsuebergabe', label: 'Durchsetzung & Verteidigung' },
  { id: 'betriebsformen', label: 'Lizenzen & Schutzrechtsbewertung' },
  { id: 'akademie', label: 'Designs' },
  { id: 'finanzierungen', label: 'Arbeitnehmererfinderrecht' },
]

export function bereichLabel(bereich: Bereich): string {
  return ALLE_BEREICHE.find((b) => b.id === bereich)?.label ?? bereich
}
