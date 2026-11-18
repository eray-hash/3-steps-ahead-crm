// Logo von 3 Steps Ahead (Wortmarke, schwarz auf transparent). Für ein neues Logo nur die Datei
// src/assets/logo/logo-original.png ersetzen. Auf dunklem Untergrund `hell` setzen: dann liegt das
// Logo auf einer weißen Fläche, damit es sichtbar bleibt.
import logoUrl from '../assets/logo/logo-original.png'

export const LOGO_URL = logoUrl
/** Seitenverhältnis der Wortmarke (Breite / Höhe). */
export const LOGO_VERHAELTNIS = 1449 / 451

export function Logo({ hoehe = 32, hell = false, className = '' }: { hoehe?: number; hell?: boolean; className?: string }) {
  const bild = <img src={logoUrl} alt="3 Steps Ahead" style={{ height: hoehe, width: Math.round(hoehe * LOGO_VERHAELTNIS) }} className="block flex-shrink-0 select-none" draggable={false} />
  if (!hell) return <span className={`inline-flex flex-shrink-0 items-center ${className}`}>{bild}</span>
  return <span className={`inline-flex flex-shrink-0 items-center rounded-lg bg-white px-2 py-1 ${className}`}>{bild}</span>
}
