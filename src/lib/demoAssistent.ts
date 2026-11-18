// Assistent der Vorführfassung: antwortet ohne Server direkt aus den Beispieldaten im Browser.
import type { AppData } from '../context/AppContext'
import { KUNDEN_BEREICHE } from '../data/kundenBereiche'
import { fmtDate, today } from './dates'

function einfach(s: string): string {
  return s.toLowerCase().replace(/[^a-zäöüß0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
}

const FUELLWOERTER = new Set(['gmbh', 'ag', 'kg', 'e', 'k', 'und', 'familie', 'erbsache', 'erbengemeinschaft', 'dr', 'co', 'partg', 'ggmbh', 'the'])

export function demoAntwort(state: AppData, frage: string): string {
  const text = einfach(frage)
  const heute = today()
  const akten = KUNDEN_BEREICHE.filter((b) => b.id !== 'privat').flatMap((b) => b.get(state).map((k) => ({ k, bereich: b.label })))

  // 1. Eine bestimmte Akte gemeint?
  const treffer = akten.find(({ k }) =>
    [k.firma, k.ansprechpartner]
      .flatMap((n) => einfach(n).split(' '))
      .some((w) => w.length > 3 && !FUELLWOERTER.has(w) && text.split(' ').includes(w)),
  )
  if (treffer) {
    const { k, bereich } = treffer
    const fu = k.followUp
    const frist = fu && !fu.done && fu.date
      ? `Nächste Frist: ${fu.note} – ${fmtDate(fu.date)}${fu.date < heute ? ' (überfällig!)' : fu.date === heute ? ' (heute fällig)' : ''}`
      : 'Keine offene Frist.'
    const verlauf = (k.activities ?? []).slice(0, 3).map((a) => `• ${fmtDate(a.date)}: ${a.text}`).join('\n')
    const doks = (k.dokumente ?? []).map((d) => d.name).slice(0, 3)
    return [
      `Hier der Stand zu ${k.firma} (${bereich}):`,
      `Zuständig: ${k.verantwortlich}`,
      frist,
      verlauf ? `Letzte Einträge:\n${verlauf}` : '',
      doks.length ? `Unterlagen in der Akte: ${doks.join(', ')}` : '',
      '',
      'Soll ich die Frist verschieben, eine Notiz anlegen oder ein Schreiben an die Gegenseite vorbereiten?',
    ].filter(Boolean).join('\n')
  }

  // 2. Fristen / Termine
  if (/frist|heute|woche|fällig|faellig|überfällig|ueberfaellig|was steht|was liegt/.test(text)) {
    const bis = new Date()
    bis.setDate(bis.getDate() + 7)
    const grenze = bis.toISOString().slice(0, 10)
    const liste = akten
      .filter(({ k }) => k.followUp && !k.followUp.done && k.followUp.date && k.followUp.date <= grenze)
      .sort((a, b) => a.k.followUp.date.localeCompare(b.k.followUp.date))
    const ueberfaellig = liste.filter(({ k }) => k.followUp.date < heute).length
    return [
      `Bis ${fmtDate(grenze)} stehen ${liste.length} Fristen und Wiedervorlagen an, davon ${ueberfaellig} bereits überfällig:`,
      ...liste.slice(0, 8).map(({ k, bereich }) => `• ${fmtDate(k.followUp.date)} – ${k.followUp.note} (${k.firma}, ${bereich}, ${k.verantwortlich})`),
      '',
      'Am dringendsten: die überfälligen Stellungnahmen. Soll ich die Zuständigen per Nachricht erinnern?',
    ].join('\n')
  }

  // 3. Honorare
  if (/rechnung|honorar|offen|bezahlt|geld|umsatz/.test(text)) {
    const offen = state.rechnungen.filter((r) => r.status !== 'Bezahlt' && r.status !== 'Entwurf')
    const summe = offen.reduce((s, r) => s + r.betragBrutto, 0)
    const ueber = offen.filter((r) => r.status === 'Überfällig')
    return [
      `Offene Honorarrechnungen: ${offen.length} über zusammen ${summe.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}.`,
      ueber.length ? `Überfällig: ${ueber.map((r) => r.nummer).join(', ')} – soll ich eine Zahlungserinnerung vorbereiten?` : 'Nichts überfällig.',
    ].join('\n')
  }

  return [
    'In der Vorführfassung beantworte ich Fragen direkt aus den Beispieldaten. Probieren Sie zum Beispiel:',
    '• „Welche Fristen stehen diese Woche an?“',
    '• „Wie ist der Stand bei Hoffmann?“',
    '• „Welche Honorarrechnungen sind offen?“',
    '',
    'Im Echtbetrieb lege ich außerdem Notizen und Aufgaben an, lese Unterlagen in der Akte und bereite Schreiben vor – auch per Sprachnachricht vom Handy.',
  ].join('\n')
}
