// Kalender der Vorführfassung: Termine liegen nur im Speicher dieses Browserfensters (keine Datenbank).
import type { Termin, Kollege } from './kalenderDb'

export const DEMO_EMAIL = 'j.sebastian@3stepsahead.de'

export const DEMO_TEAM: Kollege[] = [
  { name: 'Jens Sebastian', email: DEMO_EMAIL },
  { name: 'Lena Schubert', email: 'l.schubert@3stepsahead.de' },
  { name: 'Markus Weber', email: 'm.weber@3stepsahead.de' },
]

function zeit(tage: number, stunde: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + tage)
  d.setHours(stunde, minute, 0, 0)
  return d.toISOString()
}

let naechsteId = 1
function termin(
  tage: number, von: number, dauerMin: number, titel: string, ort: string, besitzer: string,
  teilnehmer: string[] = [], kunde?: { id: string; bereich: string; name: string }, beschreibung = '',
): Termin {
  const beginn = zeit(tage, Math.floor(von), Math.round((von % 1) * 60))
  const ende = new Date(new Date(beginn).getTime() + dauerMin * 60000).toISOString()
  return {
    id: `demo-${naechsteId++}`, titel, beschreibung, ort, beginn, ende, ganztags: false,
    besitzerEmail: besitzer, teilnehmer, kundeId: kunde?.id, kundeBereich: kunde?.bereich, kundeName: kunde?.name,
  }
}

const [JH, LS, MW] = DEMO_TEAM.map((m) => m.email)

export const demoTermine: Termin[] = [
  termin(0, 9, 45, 'Fristenbesprechung der Woche (Stuttgart und München per Video)', 'Standort Stuttgart, Besprechungsraum', JH, [LS, MW], undefined, 'Prioritätsfrist Winkelmann, Widerspruch KELLA, Erwiderung Hoffmann.'),
  termin(0, 11, 60, 'Anhörung DPMA – Anmeldung DE 10 2026 104 512.3', 'Deutsches Patent- und Markenamt, München (Videoanhörung)', MW, [JH], { id: 'k8', bereich: 'beratung', name: 'Hoffmann Kältetechnik GmbH' }),
  termin(0, 14, 90, 'Erfindergespräch Bergmann Fördertechnik – Greifersystem', 'Standort Stuttgart, Raum Neckar', JH, [LS], { id: 'k3', bereich: 'beratung', name: 'Bergmann Fördertechnik GmbH' }),
  termin(0, 16, 30, 'Telefonat Winkelmann – Länderauswahl EP', 'Telefon', JH, [], { id: 'k5', bereich: 'beratung', name: 'Winkelmann Sensorik AG' }),
  termin(0, 10, 60, 'Markenrecherche besprechen – Kaffeerösterei Lehle', 'Videokonferenz', LS, [], { id: 'e1', bereich: 'erben', name: 'Kaffeerösterei Lehle' }),
  termin(1, 10, 120, 'Termin Landgericht Mannheim, Patentstreitkammer (Az. 7 O 88/26)', 'Landgericht Mannheim, Saal 1', MW, [JH], { id: 'b4', bereich: 'betriebsuebergabe', name: 'Wendt Drucktechnik GmbH' }),
  termin(1, 15, 60, 'Verhandlung Lizenzvertrag Brückner Batteriesysteme', 'Beim Mandanten', JH, [], { id: 'f1', bereich: 'betriebsformen', name: 'Brückner Batteriesysteme GmbH' }),
  termin(2, 9, 90, 'Erfindergespräch Kranz Medizintechnik – Katheterventil', 'Standort München, Raum Isar', MW, [], { id: 'k4', bereich: 'beratung', name: 'Kranz Medizintechnik GmbH' }),
  termin(2, 14, 60, 'Besprechung Arbeitnehmererfindung – Herrmann Elektromotoren', 'Videokonferenz', LS, [JH], { id: 'g1', bereich: 'finanzierungen', name: 'Herrmann Elektromotoren GmbH' }),
  termin(3, 11, 60, 'Schutzrechtsstrategie Seidl Robotics', 'Standort München, Raum Isar', JH, [MW], { id: 'k6', bereich: 'beratung', name: 'Seidl Robotics GmbH' }),
  termin(7, 9.5, 180, 'Mündliche Verhandlung Bundespatentgericht (Nichtigkeitsklage)', 'Bundespatentgericht, München', JH, [MW], { id: 'b5', bereich: 'betriebsuebergabe', name: 'Sonnleitner Agrartechnik' }),
  termin(8, 10, 60, 'Einspruch EPA – Abstimmung Pfeiffer Lasersysteme', 'Videokonferenz', MW, [], { id: 'b3', bereich: 'betriebsuebergabe', name: 'Pfeiffer Lasersysteme AG' }),
  termin(-1, 10, 60, 'Beratung Unionsmarke – Voigt Naturkosmetik', 'Standort München, Raum Isar', LS, [], { id: 'e4', bereich: 'erben', name: 'Voigt Naturkosmetik GmbH' }),
  termin(4, 10, 120, 'Berufungsverhandlung OLG Karlsruhe (Az. 6 U 41/25), Vorinstanz LG Mannheim', 'Oberlandesgericht Karlsruhe', MW, [JH]),
  termin(2, 11, 60, 'Fristenkontrolle: Übernahme Altakten abgleichen', 'Standort Stuttgart', LS, [JH]),
  termin(1, 8.5, 60, 'Video-Termin Brightline Sensors – Antwort an EPA (auf Englisch)', 'Videokonferenz', JH, [], { id: 'k13', bereich: 'beratung', name: 'Brightline Sensors Inc.' }),
  termin(3, 15, 60, 'Lizenzverhandlung Präzisa AG – Bewertung Patentfamilie', 'Standort München, Raum Isar', JH, [MW], { id: 'f6', bereich: 'betriebsformen', name: 'Präzisa AG' }),
  termin(-1, 15, 60, 'Prüfungsbescheid Hoffmann – Ansprüche abstimmen', 'Standort Stuttgart', MW, [JH]),
]
