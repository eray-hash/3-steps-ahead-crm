// Schutzrechtsbewertung nach der Lizenzpreisanalogie (Vorführversion): Barwert der ersparten
// Lizenzzahlungen über die Restlaufzeit, als Bandbreite mit niedrigem, mittlerem und hohem Lizenzsatz.
// Zum Vergleich der Kostenansatz (Wiederbeschaffungskosten). Eingaben gelten nur in diesem Fenster.
import { useState } from 'react'
import { Card, Field, inputClass } from './ui'

type Eingabe = {
  schutzrecht: string
  umsatz: number
  wachstum: number
  lizenzMin: number
  lizenzMax: number
  restlaufzeit: number
  zins: number
  risiko: number
  kosten: number
}

const BEISPIELE: Record<string, Eingabe> = {
  f6: { schutzrecht: 'Patentfamilie EP 22 711 004 (Messverfahren Mikrobohrungen)', umsatz: 3_200_000, wachstum: 4, lizenzMin: 3, lizenzMax: 5, restlaufzeit: 11, zins: 9, risiko: 20, kosten: 650_000 },
  f2: { schutzrecht: '3 Patente Hydraulikventile (DE, EP)', umsatz: 5_800_000, wachstum: 2, lizenzMin: 2, lizenzMax: 4, restlaufzeit: 8, zins: 10, risiko: 25, kosten: 900_000 },
  f1: { schutzrecht: 'EP 24 600 912 (Zellkühlung Batteriemodul)', umsatz: 7_500_000, wachstum: 8, lizenzMin: 2.5, lizenzMax: 4.5, restlaufzeit: 15, zins: 11, risiko: 30, kosten: 1_400_000 },
}

const STANDARD: Eingabe = { schutzrecht: 'Patent DE …', umsatz: 2_000_000, wachstum: 3, lizenzMin: 2, lizenzMax: 4, restlaufzeit: 10, zins: 10, risiko: 25, kosten: 500_000 }

function barwert(e: Eingabe, satz: number): number {
  let summe = 0
  for (let t = 1; t <= Math.max(0, Math.round(e.restlaufzeit)); t++) {
    const zahlung = e.umsatz * Math.pow(1 + e.wachstum / 100, t - 1) * (satz / 100)
    summe += zahlung / Math.pow(1 + e.zins / 100, t)
  }
  return summe * (1 - e.risiko / 100)
}

const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export function SchutzrechtsbewertungSection({ kundeId }: { kundeId: string }) {
  const [e, setE] = useState<Eingabe>(BEISPIELE[kundeId] ?? STANDARD)
  const zahl = (feld: keyof Eingabe) => (ev: React.ChangeEvent<HTMLInputElement>) => setE((x) => ({ ...x, [feld]: Number(ev.target.value.replace(',', '.')) || 0 }))
  const mitte = (e.lizenzMin + e.lizenzMax) / 2
  const werte = [
    { titel: 'Niedrig', satz: e.lizenzMin, wert: barwert(e, e.lizenzMin) },
    { titel: 'Mittel', satz: mitte, wert: barwert(e, mitte) },
    { titel: 'Hoch', satz: e.lizenzMax, wert: barwert(e, e.lizenzMax) },
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-1">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Annahmen</h3>
        <div className="flex flex-col">
          <Field label="Schutzrecht">
            <input className={inputClass} value={e.schutzrecht} onChange={(ev) => setE((x) => ({ ...x, schutzrecht: ev.target.value }))} />
          </Field>
          <Field label="Umsatz mit geschützten Produkten (€ pro Jahr)"><input className={inputClass} inputMode="decimal" value={e.umsatz} onChange={zahl('umsatz')} /></Field>
          <Field label="Wachstum Umsatz (% pro Jahr)"><input className={inputClass} inputMode="decimal" value={e.wachstum} onChange={zahl('wachstum')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lizenzsatz von (%)"><input className={inputClass} inputMode="decimal" value={e.lizenzMin} onChange={zahl('lizenzMin')} /></Field>
            <Field label="bis (%)"><input className={inputClass} inputMode="decimal" value={e.lizenzMax} onChange={zahl('lizenzMax')} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Restlaufzeit (Jahre)"><input className={inputClass} inputMode="decimal" value={e.restlaufzeit} onChange={zahl('restlaufzeit')} /></Field>
            <Field label="Kapitalisierungszins (%)"><input className={inputClass} inputMode="decimal" value={e.zins} onChange={zahl('zins')} /></Field>
          </div>
          <Field label="Abschlag für Rechtsbestand und Umgehbarkeit (%)"><input className={inputClass} inputMode="decimal" value={e.risiko} onChange={zahl('risiko')} /></Field>
          <Field label="Kosten einer Neuentwicklung (€, Kostenansatz)"><input className={inputClass} inputMode="decimal" value={e.kosten} onChange={zahl('kosten')} /></Field>
        </div>
      </Card>
      <Card className="p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-slate-700">Schutzrechtsbewertung</h3>
        <p className="mb-4 text-xs text-slate-500">{e.schutzrecht} · Lizenzpreisanalogie: Barwert der ersparten Lizenzzahlungen über die Restlaufzeit</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {werte.map((w) => (
            <div key={w.titel} className={`rounded-lg border p-4 ${w.titel === 'Mittel' ? 'border-accent-600 bg-accent-50' : 'border-slate-200'}`}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{w.titel} · {w.satz.toLocaleString('de-DE')} %</div>
              <div className="mt-1 text-xl font-semibold text-slate-800">{eur(w.wert)}</div>
            </div>
          ))}
        </div>
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between border-b border-slate-100 py-1.5"><dt className="text-slate-500">Bandbreite</dt><dd className="font-medium text-slate-800">{eur(werte[0].wert)} – {eur(werte[2].wert)}</dd></div>
          <div className="flex justify-between border-b border-slate-100 py-1.5"><dt className="text-slate-500">Kostenansatz (Untergrenze)</dt><dd className="font-medium text-slate-800">{eur(e.kosten)}</dd></div>
          <div className="flex justify-between border-b border-slate-100 py-1.5"><dt className="text-slate-500">Lizenzzahlung im 1. Jahr (Mittel)</dt><dd className="font-medium text-slate-800">{eur(e.umsatz * mitte / 100)}</dd></div>
          <div className="flex justify-between border-b border-slate-100 py-1.5"><dt className="text-slate-500">Abschlag Rechtsbestand</dt><dd className="font-medium text-slate-800">{e.risiko.toLocaleString('de-DE')} %</dd></div>
        </dl>
        <p className="mt-4 text-xs text-slate-400">Überschlägige Bewertung als Gesprächsgrundlage, kein Gutachten. Rechtlich (Rechtsbestand, Schutzumfang), wirtschaftlich (Umsatz, Lizenzsätze) und technisch (Umgehbarkeit) begründet.</p>
      </Card>
    </div>
  )
}
