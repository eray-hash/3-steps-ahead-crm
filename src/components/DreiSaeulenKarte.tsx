// „Drei Säulen“: jedes Mandat rechtlich, wirtschaftlich und technisch betrachtet. Werte kommen aus den
// Beispieldaten (data/dreiSaeulen.ts); ohne Eintrag erscheint die Karte nicht.
import { Scale, TrendingUp, Cog } from 'lucide-react'
import { DREI_SAEULEN } from '../data/dreiSaeulen'
import { Card } from './ui'

export function DreiSaeulenKarte({ kundeId }: { kundeId: string }) {
  const s = DREI_SAEULEN[kundeId]
  if (!s) return null
  const zeilen = [
    { icon: Scale, titel: 'Recht', text: s.recht },
    { icon: TrendingUp, titel: 'Wirtschaft', text: s.wirtschaft },
    { icon: Cog, titel: 'Technik', text: s.technik },
  ]
  return (
    <Card className="mb-5 p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Drei Säulen</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {zeilen.map(({ icon: Icon, titel, text }) => (
          <div key={titel} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Icon size={13} /> {titel}
            </div>
            <p className="text-sm text-slate-700">{text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
