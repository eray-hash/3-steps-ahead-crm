// Beispieldaten der Vorführfassung „3 Steps Ahead Patentanwälte“. Alle Namen, Firmen, Erfindungen und
// Aktenzeichen sind frei erfunden. Datumsangaben sind relativ zu heute, damit Fristen immer aktuell wirken.
import type { Kunde, Rechnung, Protokoll, Konzept, Beratungsvertrag, Vorlage, Prioritaet, ToDoEintrag } from '../types'
import type { Projekt, Aufgabe } from '../types/project'
import { addDays, uid, today } from '../lib/dates'

const rel = (tage: number) => addDays(today(), tage)

const JH = 'Jens Sebastian'
const MW = 'Markus Weber'
const LS = 'Lena Schubert'
const TK = 'Tobias Krämer'

type Zeile = [
  id: string,
  firma: string,
  ansprechpartner: string,
  email: string,
  telefon: string,
  prioritaet: Prioritaet,
  status: string,
  frist: [tage: number, notiz: string],
  verantwortlich: string,
  verlauf: [tage: number, text: string, wer: string][],
  dokumente?: [name: string, typ: string, tage: number, groesse: string][],
]

function mandanten(zeilen: Zeile[]): Kunde[] {
  return zeilen.map(([id, firma, ansprechpartner, email, telefon, prioritaet, status, [fTage, fNotiz], verantwortlich, verlauf, dokumente]) => ({
    id,
    firma,
    ansprechpartner,
    email,
    telefon,
    prioritaet,
    status,
    followUp: { date: rel(fTage), note: fNotiz, done: false },
    // Kleines Team: Fachangestellte Lena Schubert führt keine eigenen Akten.
    verantwortlich: verantwortlich === TK ? MW : verantwortlich === LS ? JH : verantwortlich,
    letzteAktivitaet: rel(Math.max(...verlauf.map((v) => v[0]))),
    activities: verlauf
      .slice()
      .sort((a, b) => b[0] - a[0])
      .map(([t, text, user]) => ({ id: uid('act'), date: rel(t), text, user: user === TK ? LS : user })),
    dokumente: (dokumente ?? []).map(([name, typ, t, groesse]) => ({ id: uid('dok'), name, typ, datum: rel(t), groesse })),
  }))
}

// ---------- Patente — Ids k1–k10 bleiben, Rechnungen hängen daran ----------
export const kanzleiWirtschaft: Kunde[] = mandanten([
  ['k1', 'Neckarwerk Antriebstechnik GmbH, Esslingen', 'Dr. Sabine Kellermann', 's.kellermann@neckarwerk-antriebe.de', '+49 711 39 12 340', 'Hoch', 'lead',
    [1, 'Erfindungsmeldung „Zweigang-Getriebe für E-Achsen“ sichten, Erfindergespräch anbieten'], MW,
    [[-1, 'Neue Erfindungsmeldung über das Formular eingegangen', 'System']]],
  ['k2', 'Lumetra Optik GmbH, Tübingen', 'Michael Groß', 'm.gross@lumetra-optik.de', '+49 7071 88 21 90', 'Mittel', 'erstkontakt',
    [3, 'Neuheitsrecherche zur Linsenbeschichtung anstoßen'], TK,
    [[-4, 'Telefonat: Ausgründung der Universität Tübingen möchte vor Messeauftritt anmelden', TK]]],
  ['k3', 'Bergmann Fördertechnik GmbH, Ludwigsburg', 'Christine Bergmann', 'c.bergmann@bergmann-foerdertechnik.de', '+49 7141 40 33 12', 'Hoch', 'termin',
    [0, 'Erfindergespräch heute 14:00 Uhr – Zeichnungen mitbringen lassen'], JH,
    [[-2, 'Erfindergespräch für heute vereinbart', JH], [-5, 'Anfrage: Greifersystem für Paletten, Messe in 8 Wochen', 'System']],
    [['Skizzen_Greifer_v2.pdf', 'PDF', -2, '1,8 MB']]],
  ['k4', 'Kranz Medizintechnik GmbH, Tuttlingen', 'Reinhard Kranz', 'r.kranz@kranz-medtech.de', '+49 7461 77 40 11', 'Mittel', 'durchgefuehrt',
    [2, 'Kostenvoranschlag DE + EP-Anmeldung senden'], MW,
    [[-3, 'Erfindergespräch geführt: Katheterventil, zwei Ausführungsformen', MW]]],
  ['k5', 'Winkelmann Sensorik AG, Waiblingen', 'Peter Winkelmann', 'p.winkelmann@winkelmann-sensorik.de', '+49 7151 21 08 45', 'Hoch', 'konzept',
    [0, 'Prioritätsfrist (12 Monate) läuft heute ab – EP-Nachanmeldung einreichen (Prio DE 10 2025 118 204.7)'], JH,
    [[-6, 'Anspruchssatz für EP-Nachanmeldung abgestimmt', JH], [-20, 'Freigabe der Zeichnungen durch Erfinder', TK]],
    [['Anspruchssatz_EP_Entwurf.docx', 'Word', -6, '92 KB'], ['Prioritaetsanmeldung_DE_10_2025_118_204.pdf', 'PDF', -340, '2,1 MB']]],
  ['k6', 'Seidl Robotics GmbH, Böblingen', 'Dr. Anna Seidl', 'a.seidl@seidl-robotics.de', '+49 7031 66 20 80', 'Hoch', 'angebot',
    [4, 'Kostenvoranschlag Schutzrechtsstrategie nachfassen'], JH,
    [[-2, 'Kostenvoranschlag für 4 Anmeldungen versendet', JH], [-8, 'Besprechung: Patentportfolio vor Finanzierungsrunde', JH]]],
  ['k7', 'Amberger Feinmechanik GmbH, Göppingen', 'Florian Amberger', 'f.amberger@amberger-fm.de', '+49 7161 98 33 21', 'Hoch', 'unterschrieben',
    [5, 'Verletzungsrecherche: Wettbewerberpatente sichten'], JH,
    [[-1, 'Mandatsvereinbarung unterschrieben zurück', 'System'], [-7, 'Auftrag: Freiheit zur Ausübung für neue Spindel prüfen', JH]],
    [['Mandatsvereinbarung_Amberger.pdf', 'PDF', -1, '210 KB'], ['Vollmacht_DPMA_Amberger.pdf', 'PDF', -1, '95 KB']]],
  ['k8', 'Hoffmann Kältetechnik GmbH, Sindelfingen', 'Elisabeth Hoffmann', 'e.hoffmann@hoffmann-kaelte.de', '+49 7031 30 12 77', 'Hoch', 'aktives_mandat',
    [2, 'Frist: Erwiderung auf Prüfungsbescheid DPMA (Az. DE 10 2026 104 512.3)'], MW,
    [[-3, 'Entwurf Erwiderung mit geänderten Ansprüchen an Mandantin', MW], [-12, 'Prüfungsbescheid DPMA eingegangen, Frist 4 Monate notiert', TK], [-150, 'Prüfungsantrag gestellt', TK]],
    [['Pruefungsbescheid_DE102026104512.pdf', 'PDF', -12, '640 KB'], ['Entwurf_Erwiderung.docx', 'Word', -3, '88 KB']]],
  ['k9', 'Seidel Mechatronik GmbH, Reutlingen', 'Jan Seidel', 'j.seidel@seidel-mechatronik.de', '+49 7121 55 90 12', 'Mittel', 'rechnung_gestellt',
    [6, 'Jahresgebühr 4. Jahr fällig (DE 10 2023 002 117.1)'], TK,
    [[-5, 'Erteilungsbeschluss eingegangen, Rechnung versendet', TK], [-60, 'Hilfsantrag im Prüfungsverfahren angenommen', MW]],
    [['Erteilungsbeschluss_DE102023002117.pdf', 'PDF', -5, '420 KB']]],
  ['k10', 'Brandt Fahrzeugtechnik GmbH, Heilbronn', 'Katrin Brandt', 'k.brandt@brandt-fahrzeugtechnik.de', '+49 7131 88 12 30', 'Niedrig', 'abgeschlossen',
    [30, 'Nachfassen: weitere Erfindung aus der Entwicklung angekündigt'], JH,
    [[-16, 'EP-Patent EP 25 701 118.2 erteilt, Validierung in DE, FR, IT erledigt', JH]]],
  ['k11', 'Hohenlohe Pflanzenzucht GmbH, Öhringen', 'Dr. Ralf Ehrmann', 'r.ehrmann@hohenlohe-zucht.de', '+49 7941 55 30 12', 'Mittel', 'aktives_mandat',
    [12, 'Sortenschutz: Antwort auf Prüfbericht Bundessortenamt zur Apfelsorte „Neckarglanz“'], JH,
    [[-14, 'Gemeinschaftlichen Sortenschutz beim Gemeinschaftlichen Sortenamt beantragt', JH], [-60, 'Registerprüfung beim Bundessortenamt läuft', LS]]],
  ['k12', 'Neckarsoft GmbH, Stuttgart', 'Jonas Albers', 'j.albers@neckarsoft.de', '+49 711 66 44 210', 'Hoch', 'konzept',
    [6, 'Software-Patent: technischen Beitrag der Fahrerassistenz-Funktion herausarbeiten (Anforderungen EPA)'], MW,
    [[-3, 'Erfindergespräch mit Entwicklern, Ablaufdiagramme erhalten', MW]],
    [['Ablaufdiagramme_Spurhaltung.pdf', 'PDF', -3, '1,1 MB']]],
  ['k13', 'Brightline Sensors Inc., Boston (USA)', 'Emily Carter', 'e.carter@brightline-sensors.com', '+1 617 555 0142', 'Hoch', 'aktives_mandat',
    [9, 'EP 26 812 345.6: Antwort auf Recherchebericht EPA (Verfahrenssprache Englisch)'], JH,
    [[-5, 'Recherchebericht EPA eingegangen, an US-Anwälte weitergeleitet', LS], [-120, 'EP-Anmeldung aus US-Priorität eingereicht', JH]]],
  ['k14', 'Alpentech Hydraulik GmbH, Linz (Österreich)', 'Mag. Thomas Huber', 't.huber@alpentech.at', '+43 732 55 10 20', 'Mittel', 'angebot',
    [4, 'Kostenvoranschlag EP mit Benennung AT, DE, CH nachfassen'], MW,
    [[-6, 'Erstberatung per Video: Ventilblock für Mobilhydraulik', MW]]],
])

// ---------- Marken ----------
export const kanzleiErbrecht: Kunde[] = mandanten([
  ['e1', 'Kaffeerösterei Lehle, Stuttgart', 'Johannes Lehle', 'j.lehle@lehle-kaffee.de', '+49 711 22 41 008', 'Mittel', 'erstkontakt',
    [1, 'Markenrecherche „BOHNENWERK“ in Klassen 30 und 43'], LS,
    [[-2, 'Anfrage: Wortmarke vor Filialeröffnung schützen', LS]]],
  ['e2', 'Keller Outdoor GmbH, Metzingen', 'Margarete Keller', 'm.keller@keller-outdoor.de', '+49 7123 44 21 90', 'Hoch', 'unterlagen_angefordert',
    [1, 'Widerspruchsfrist gegen jüngere Marke „KELLA“ endet (DE 30 2026 012 345)'], LS,
    [[-10, 'Ähnlichkeitsrecherche: kollidierende Anmeldung gefunden', LS]],
    [['Recherchebericht_Aehnlichkeit.pdf', 'PDF', -10, '780 KB']]],
  ['e3', 'Ostermann Design Studio, Stuttgart', 'Dr. Michael Ostermann', 'm.ostermann@ostermann-design.de', '+49 711 22 87 561', 'Mittel', 'konzept_erstellt',
    [2, 'Wort-Bild-Marke (Logo) für Leuchtenserie beim DPMA anmelden'], LS,
    [[-3, 'Logo-Entwurf vom Mandanten freigegeben', LS]]],
  ['e4', 'Voigt Naturkosmetik GmbH, Leonberg', 'Sabrina Voigt', 'kontakt@voigt-naturkosmetik.de', '+49 7152 33 40 77', 'Mittel', 'beratungsgespraech',
    [4, 'Unionsmarke beim EUIPO vorbereiten, Waren- und Dienstleistungsverzeichnis'], LS,
    [[-1, 'Beratung: Ausweitung der deutschen Marke auf die EU', LS]]],
  ['e5', 'Rehnert Getränke GmbH, Waiblingen', 'Jutta Rehnert', 'j.rehnert@rehnert-getraenke.de', '+49 7151 88 12 00', 'Hoch', 'umsetzung',
    [-2, 'Wiedervorlage: Benutzungsnachweise beim Mandanten nachfordern (Widerspruchsverfahren DPMA)'], JH,
    [[-4, 'Widerspruchsbegründung der Gegenseite eingegangen', TK], [-25, 'Benutzungsnachweise beim Mandanten angefordert', LS]],
    [['Widerspruchsbegruendung_Gegenseite.pdf', 'PDF', -4, '540 KB']]],
  ['e6', 'Strobel Werkzeugbau KG, Göppingen', 'Helmut Strobel', 'h.strobel@strobel-werkzeugbau.de', '+49 7161 30 55 12', 'Niedrig', 'abgeschlossen',
    [60, 'Verlängerung Marke „STROBELFIX“ (Schutzdauer endet in 6 Monaten)'], LS,
    [[-20, 'Marke im Register eingetragen, Urkunde versendet', LS]]],
])

// ---------- Durchsetzung & Verteidigung ----------
export const kanzleiNachfolge: Kunde[] = mandanten([
  ['b1', 'Kronberg Pumpen GmbH, Heilbronn', 'Wilhelm Brenner', 'w.brenner@kronberg-pumpen.de', '+49 7131 20 33 10', 'Hoch', 'erstkontakt',
    [3, 'Abmahnung eines Wettbewerbers prüfen, Antwortfrist 14 Tage'], MW,
    [[-2, 'Abmahnung wegen angeblicher Patentverletzung erhalten', MW]],
    [['Abmahnung_Gegenseite.pdf', 'PDF', -2, '310 KB']]],
  ['b2', 'Albrecht Verpackungsmaschinen GmbH, Waiblingen', 'Klaus Albrecht', 'k.albrecht@albrecht-vm.de', '+49 7151 88 40 22', 'Hoch', 'bedarfsanalyse',
    [-1, 'Wiedervorlage: Merkmalsgliederung Klagepatent EP 21 704 556.1 gegen Verletzungsform'], JH,
    [[-3, 'Muster des Konkurrenzprodukts eingegangen', 'System'], [-8, 'Besprechung: Nachbau auf der Messe in Stuttgart entdeckt – Gerichtsstand LG Mannheim oder LG Düsseldorf abwägen', JH]]],
  ['b3', 'Pfeiffer Lasersysteme AG, Ditzingen', 'Martina Pfeiffer', 'm.pfeiffer@pfeiffer-laser.de', '+49 7156 77 10 00', 'Hoch', 'unternehmensbewertung',
    [9, 'Einspruchsfrist (9 Monate) gegen EP 21 990 118.4 – Einspruchsschrift EPA'], MW,
    [[-12, 'Druckschriften zum Stand der Technik zusammengestellt', TK]],
    [['Stand_der_Technik_D1-D5.pdf', 'PDF', -12, '3,4 MB']]],
  ['b4', 'Wendt Drucktechnik GmbH, Ludwigsburg', 'Georg Wendt', 'g.wendt@wendt-druck.de', '+49 7141 66 18 30', 'Hoch', 'verhandlung',
    [3, 'Frist: Replik an Landgericht Mannheim (Patentstreitkammer, Az. 7 O 88/26)'], MW,
    [[-2, 'Klageerwiderung der Beklagten eingegangen', MW], [-40, 'Verletzungsklage eingereicht', MW]],
    [['Klageerwiderung_7_O_88-26.pdf', 'PDF', -2, '2,6 MB']]],
  ['b5', 'Sonnleitner Agrartechnik GmbH, Bietigheim-Bissingen', 'Franz Sonnleitner', 'f.sonnleitner@sonnleitner-agrar.de', '+49 7142 22 90 11', 'Mittel', 'notartermin',
    [7, 'Mündliche Verhandlung Bundespatentgericht (Nichtigkeitsklage)'], JH,
    [[-4, 'Ladung zur mündlichen Verhandlung erhalten', TK]]],
])

// ---------- Lizenzen & Schutzrechtsbewertung ----------
export const kanzleiArbeitsrecht: Kunde[] = mandanten([
  ['f1', 'Brückner Batteriesysteme GmbH, Sindelfingen', 'Stefan Brückner', 's.brueckner@brueckner-batterie.de', '+49 7031 22 40 88', 'Hoch', 'erstkontakt',
    [0, 'Vertraulichkeitsvereinbarung vor Gespräch mit Lizenznehmer zusenden'], JH,
    [[-1, 'Anfrage: Lizenzvergabe des Zellkühlungspatents nach Asien', JH]]],
  ['f2', 'Kessler Hydraulik GmbH, Esslingen', 'Dorothea Kessler', 'd.kessler@kessler-hydraulik.de', '+49 711 40 11 20', 'Mittel', 'bedarfsanalyse',
    [4, 'Bewertung der 3 Patente für Lizenzgebühr (Stücklizenz)'], MW,
    [[-5, 'Unterlagen zu Umsatzzahlen eingegangen', TK]]],
  ['f3', 'Neumeier Medizinsoftware GmbH, Tübingen', 'Claudia Neumeier', 'c.neumeier@neumeier-med.de', '+49 7071 55 21 30', 'Hoch', 'konzept_erstellt',
    [2, 'Entwurf Forschungs- und Entwicklungsvertrag mit Hochschule abstimmen'], JH,
    [[-3, 'Entwurf Kooperationsvertrag versendet', JH]],
    [['Entwurf_FuE_Vertrag.docx', 'Word', -3, '120 KB']]],
  ['f4', 'Hübner E-Antriebe GmbH, Böblingen', 'Ralf Hübner', 'r.huebner@huebner-antriebe.de', '+49 7031 50 77 40', 'Mittel', 'umsetzung',
    [-2, 'Wiedervorlage: Rückmeldung zu Änderungswünschen des Lizenznehmers'], MW,
    [[-6, 'Lizenznehmer verlangt Exklusivität für Nordamerika', MW]]],
  ['f5', 'Lindt Mikrosysteme GmbH, Reutlingen', 'Marco Lindt', 'm.lindt@lindt-mikro.de', '+49 7121 88 40 11', 'Niedrig', 'abgeschlossen',
    [45, 'Erste Lizenzabrechnung prüfen'], JH,
    [[-9, 'Lizenzvertrag unterschrieben, 4 % Stücklizenz', JH]]],
  ['f6', 'Präzisa AG, Winterthur (Schweiz)', 'Urs Meier', 'u.meier@praezisa.ch', '+41 52 260 44 10', 'Hoch', 'beratungsgespraech',
    [3, 'Lizenz erwerben: Stücklizenz und Schutzrechtsbewertung für Patentfamilie EP 22 711 004'], JH,
    [[-4, 'Bewertung der Patentfamilie: Restlaufzeit 11 Jahre, Lizenzanalogie 3–5 %', MW]]],
])

// ---------- Designs ----------
export const kanzleiSeminare: Kunde[] = mandanten([
  ['a1', 'Kürner Gerätebau GmbH, Waiblingen', 'Sebastian Kürner', 's.kuerner@kuerner-geraetebau.de', '+49 7151 20 05 11', 'Mittel', 'anmeldung_eingegangen',
    [3, 'Darstellungen Akkuschrauber-Gehäuse (7 Ansichten) mit Mandant abstimmen'], MW,
    [[-4, 'Auftrag: Gehäuseform vor Markteinführung schützen', MW]]],
  ['a2', 'Aydin Sanitärtechnik GmbH, Ludwigsburg', 'Deniz Aydin', 'd.aydin@aydin-sanitaer.de', '+49 7141 40 33 80', 'Hoch', 'platz_bestaetigt',
    [1, 'Gemeinschaftsgeschmacksmuster beim EUIPO einreichen – Armaturenserie (Sammelanmeldung)'], JH,
    [[-6, 'Neuheitsschonfrist geprüft: Messeauftritt vor 5 Monaten, Anmeldung noch möglich', JH]]],
  ['a3', 'Frey Fahrradkomponenten GmbH, Tübingen', 'Nadine Frey', 'n.frey@frey-bikes.de', '+49 7071 66 90 21', 'Mittel', 'interessent',
    [5, 'Designrecherche: ähnliche Lenkerformen im Register prüfen'], MW,
    [[-2, 'Anfrage per Telefon', LS]]],
  ['a4', 'Kienzle Elektrowerkzeuge GmbH, Göppingen', 'Rainer Kienzle', 'r.kienzle@kienzle-werkzeuge.de', '+49 7161 22 40 70', 'Niedrig', 'abgeschlossen',
    [40, 'Verlängerung eingetragenes Design (Schutzdauer 5 Jahre läuft ab)'], LS,
    [[-10, 'Design DE 40 2026 100 778-0001 eingetragen', MW]]],
  ['a5', 'Brightline Sensors Inc., Boston (USA)', 'Emily Carter', 'e.carter@brightline-sensors.com', '+1 617 555 0142', 'Mittel', 'kurs_laeuft',
    [8, 'Internationale Designanmeldung (Haager System) – Gehäuse Messgerät'], JH,
    [[-9, 'Video-Termin mit US-Mandantin, Anmeldung auf Englisch besprochen', JH]]],
])

// ---------- Arbeitnehmererfinderrecht ----------
export const kanzleiBankrecht: Kunde[] = mandanten([
  ['g1', 'Herrmann Elektromotoren GmbH, Esslingen', 'Werner Herrmann', 'w.herrmann@herrmann-motoren.de', '+49 711 34 88 201', 'Hoch', 'interessent',
    [2, 'Frist zur Inanspruchnahme (4 Monate) prüfen – Diensterfindung Kühlrippe'], LS,
    [[-3, 'Erfindungsmeldung eines Mitarbeiters weitergeleitet', LS]]],
  ['g2', 'Andrea Schmidtke (Erfinderin), Böblingen', 'Andrea Schmidtke', 'a.schmidtke@beispiel.de', '+49 7031 66 21 40', 'Hoch', 'beratungsgespraech',
    [4, 'Frist: Widerspruch gegen Vergütungsfestsetzung (2 Monate)'], JH,
    [[-2, 'Arbeitgeber setzt Vergütung zu niedrig fest, Lizenzanalogie prüfen', JH]],
    [['Verguetungsfestsetzung.pdf', 'PDF', -2, '210 KB']]],
  ['g3', 'Hellmann Zulieferteile GmbH, Reutlingen', 'Thorsten Hellmann', 't.hellmann@hellmann-zulieferteile.de', '+49 7121 90 33 18', 'Mittel', 'zeichnung_eingegangen',
    [5, 'Richtlinie für Erfindervergütung im Unternehmen entwerfen'], LS,
    [[-7, 'Auftrag: einheitliche Vergütungsregeln für 12 Erfinder', LS]]],
  ['g4', 'Brandenburg Präzisionsteile GmbH, Sindelfingen', 'Ute Brandenburg', 'u.brandenburg@brandenburg-praezision.de', '+49 7031 22 18 70', 'Niedrig', 'abgeschlossen',
    [90, 'Jährliche Vergütungsabrechnung an Erfinder'], TK,
    [[-11, 'Vergütungsvereinbarung mit zwei Erfindern unterschrieben', LS]]],
])

// ---------- Rechnungen (Amtsgebühren + Honorar), Protokolle, Mandatsvereinbarungen ----------
export const kanzleiRechnungen: Rechnung[] = [
  { id: uid('r'), nummer: 'PA-2026-1001', kundeId: 'k7', datum: rel(-40), betragNetto: 4200, betragBrutto: 4998, status: 'Bezahlt', zahlungsziel: rel(-26), leistungBezeichnung: 'Recherche und Gutachten, Stundenhonorar', leistungEinheit: 'Stunde', leistungMenge: 14 },
  { id: uid('r'), nummer: 'PA-2026-1014', kundeId: 'k8', datum: rel(-35), betragNetto: 3150, betragBrutto: 3675, status: 'Bezahlt', zahlungsziel: rel(-21), leistungBezeichnung: 'Prüfungsantrag DPMA: Amtsgebühr 350 € + Honorar' },
  { id: uid('r'), nummer: 'PA-2026-1022', kundeId: 'k8', datum: rel(-12), betragNetto: 2400, betragBrutto: 2856, status: 'Versendet', zahlungsziel: rel(16), leistungBezeichnung: 'Erwiderung auf Prüfungsbescheid, Honorar' },
  { id: uid('r'), nummer: 'PA-2026-1031', kundeId: 'k9', datum: rel(-5), betragNetto: 1850, betragBrutto: 2061, status: 'Versendet', zahlungsziel: rel(9), leistungBezeichnung: 'Erteilung + Jahresgebühr 4. Jahr (Amtsgebühr 70 €) + Honorar' },
  { id: uid('r'), nummer: 'PA-2026-0987', kundeId: 'k9', datum: rel(-52), betragNetto: 2100, betragBrutto: 2499, status: 'Überfällig', zahlungsziel: rel(-24), leistungBezeichnung: 'Hilfsantrag im Prüfungsverfahren, Honorar' },
  { id: uid('r'), nummer: 'PA-2026-1035', kundeId: 'k10', datum: rel(-16), betragNetto: 7900, betragBrutto: 9040, status: 'Bezahlt', zahlungsziel: rel(-2), leistungBezeichnung: 'Validierung EP-Patent DE/FR/IT: Amtsgebühren + Übersetzungen + Honorar' },
  { id: uid('r'), nummer: 'PA-2026-0965', kundeId: 'k10', datum: rel(-70), betragNetto: 5400, betragBrutto: 6426, status: 'Überfällig', zahlungsziel: rel(-40), leistungBezeichnung: 'Erteilungsgebühr EPA + Honorar' },
  { id: uid('r'), nummer: 'PA-2026-1040', kundeId: 'k7', datum: rel(-1), betragNetto: 1800, betragBrutto: 2142, status: 'Entwurf', zahlungsziel: rel(29), leistungBezeichnung: 'Verletzungsrecherche, Abschlag 1', leistungEinheit: 'Stunde', leistungMenge: 6 },
]

export const kanzleiProtokolle: Protokoll[] = [
  { id: uid('p'), bereich: 'beratung', kundeId: 'k3', datum: rel(-2), teilnehmer: 'Christine Bergmann, Jens Sebastian', betreff: 'Telefonat vor dem Erfindergespräch', text: 'Erfindung kurz beschrieben: Greifer mit federnder Klemmleiste. Wichtig: noch nichts öffentlich gezeigt. Zeichnungen und Prototypfotos mitbringen.' },
  { id: uid('p'), bereich: 'beratung', kundeId: 'k5', datum: rel(-9), teilnehmer: 'Peter Winkelmann, Jens Sebastian', betreff: 'Abstimmung Nachanmeldung', text: 'Länderauswahl für EP besprochen: DE, FR, IT, NL. Zusätzlich US-Anmeldung über Partnerkanzlei.' },
  { id: uid('p'), bereich: 'beratung', kundeId: 'k8', datum: rel(-12), teilnehmer: 'Elisabeth Hoffmann, Markus Weber', betreff: 'Besprechung Prüfungsbescheid', text: 'Prüfer hält Anspruch 1 gegenüber D1 für nicht erfinderisch. Merkmal aus Anspruch 4 in Anspruch 1 aufnehmen.' },
  { id: uid('p'), bereich: 'beratung', kundeId: 'k8', datum: rel(-150), teilnehmer: 'Elisabeth Hoffmann, Markus Weber', betreff: 'Prüfungsantrag', text: 'Prüfungsantrag gestellt, Recherchebericht liegt vor.' },
]

export const kanzleiKonzepte: Konzept[] = [
  { id: uid('c'), kundeId: 'k5', datum: rel(-7), titel: 'Anspruchssatz EP-Nachanmeldung', version: 'v1.2', status: 'Vorgestellt' },
  { id: uid('c'), kundeId: 'k6', datum: rel(-9), titel: 'Schutzrechtsstrategie Robotik', version: 'v1.0', status: 'Angebot erstellt' },
  { id: uid('c'), kundeId: 'k7', datum: rel(-14), titel: 'Prüfplan Verletzungsrecherche Spindel', version: 'v2.0', status: 'Angenommen' },
]

export const kanzleiVertraege: Beratungsvertrag[] = [
  { id: uid('v'), kundeId: 'k7', vertragsnr: 'MV-2026-044', datum: rel(-1), laufzeit: 'bis Abschluss', volumen: 18000, datei: 'Mandatsvereinbarung_Amberger.pdf' },
  { id: uid('v'), kundeId: 'k8', vertragsnr: 'MV-2025-198', datum: rel(-30), laufzeit: 'Dauermandat', volumen: 36000, datei: 'Dauermandat_Hoffmann.pdf' },
  { id: uid('v'), kundeId: 'k9', vertragsnr: 'MV-2025-176', datum: rel(-60), laufzeit: 'bis Erteilung', volumen: 9000, datei: 'Mandatsvereinbarung_Seidel.pdf' },
  { id: uid('v'), kundeId: 'k10', vertragsnr: 'MV-2025-140', datum: rel(-90), laufzeit: 'bis Erteilung', volumen: 22000, datei: 'Mandatsvereinbarung_Brandt.pdf' },
]

// ---------- Vorlagen ----------
const erfindungsmeldung = `ERFINDUNGSMELDUNG

Mandant / Arbeitgeber: {name}
Datum der Meldung: {datum}

1. Bezeichnung der Erfindung
______________________

2. Erfinder (Name, Anschrift, Anteil in %)
______________________

3. Welches technische Problem wird gelöst?
______________________

4. Wie wird es gelöst? (Beschreibung, Zeichnungen beifügen)
______________________

5. Bekannter Stand der Technik (Wettbewerbsprodukte, Veröffentlichungen)
______________________

6. Wurde die Erfindung bereits gezeigt, verkauft oder veröffentlicht? Wenn ja: wann und wo?
______________________

7. Geplante Nutzung und Märkte
______________________

Wichtig: Bitte vor der Anmeldung nichts veröffentlichen – sonst ist die Erfindung nicht mehr neu.

______________________
Unterschrift Erfinder`

const vertraulichkeit = `VERTRAULICHKEITSVEREINBARUNG

zwischen {name} („offenlegende Partei“)
und ______________________ („empfangende Partei“)

1. Gegenstand: Die offenlegende Partei stellt Informationen zu ______________________ zur Verfügung, um eine mögliche Zusammenarbeit zu prüfen.
2. Die empfangende Partei behandelt alle Informationen vertraulich, gibt sie nicht an Dritte weiter und nutzt sie nur zu dem genannten Zweck.
3. Ausgenommen sind Informationen, die nachweislich bereits öffentlich bekannt waren.
4. Es werden keine Rechte an Schutzrechten oder Erfindungen übertragen. Eine Patentanmeldung durch die empfangende Partei ist ausgeschlossen.
5. Laufzeit: 5 Jahre ab Unterzeichnung.

{ort}, den {datum}

______________________          ______________________`

const vollmachtDpma = `VOLLMACHT

Hiermit bevollmächtige(n) ich/wir, {name},

die Patentanwälte 3 Steps Ahead, Jens Sebastian und Kollegen, Königstraße 17, 70173 Stuttgart,

mich/uns in allen Angelegenheiten des gewerblichen Rechtsschutzes vor dem Deutschen Patent- und Markenamt, dem Bundespatentgericht, dem Europäischen Patentamt und dem Amt der Europäischen Union für geistiges Eigentum zu vertreten, insbesondere Anmeldungen einzureichen, Anträge zu stellen und zurückzunehmen, Gebühren zu zahlen und Zustellungen entgegenzunehmen.

Untervollmacht darf erteilt werden.

{ort}, den {datum}

______________________
Unterschrift`

const lizenzvertrag = `LIZENZVERTRAG

zwischen {name} („Lizenzgeber“)
und ______________________ („Lizenznehmer“)

§ 1 Vertragsschutzrechte
Patent DE ______________________ sowie zugehörige Auslandsschutzrechte.

§ 2 Lizenzumfang
Der Lizenzgeber räumt eine □ einfache □ ausschließliche Lizenz zur Herstellung und zum Vertrieb im Gebiet ______________________ ein.

§ 3 Lizenzgebühr
__ % vom Nettoverkaufspreis je Stück, abzurechnen vierteljährlich. Mindestlizenz: ______ € pro Jahr.

§ 4 Aufrechterhaltung
Der Lizenzgeber zahlt die Jahresgebühren und hält die Schutzrechte aufrecht.

§ 5 Laufzeit und Kündigung
Bis zum Ablauf des letzten Vertragsschutzrechts; Kündigung aus wichtigem Grund bleibt unberührt.

{ort}, den {datum}

______________________          ______________________
Lizenzgeber                      Lizenznehmer`

const mandatsvereinbarung = `MANDATSVEREINBARUNG

zwischen {name} und den Patentanwälten 3 Steps Ahead

1. Gegenstand: Anmeldung, Verteidigung und Verwaltung von Schutzrechten für ______________________.
2. Vergütung: Stundenhonorar 290,00 € zzgl. USt; Amtsgebühren und Auslagen werden gesondert und ohne Aufschlag weiterberechnet.
3. Fristenüberwachung: Die Kanzlei überwacht alle amtlichen Fristen und erinnert rechtzeitig an Jahresgebühren und Verlängerungen.
4. Haftung: begrenzt auf 1.000.000 € je Schadensfall.

{ort}, den {datum}

______________________          ______________________
Mandant                          Kanzlei`

function vorlagen(): Vorlage[] {
  return [
    { id: uid('vl'), kategorie: 'vollmacht', name: 'Vollmacht DPMA / EPA / EUIPO', typ: 'Vollmacht', zuletztGeaendert: rel(-12), text: vollmachtDpma },
    { id: uid('vl'), kategorie: 'formulare', name: 'Erfindungsmeldung', typ: 'Formular', zuletztGeaendert: rel(-9), text: erfindungsmeldung },
    { id: uid('vl'), kategorie: 'vertraege', name: 'Vertraulichkeitsvereinbarung', typ: 'Vertrag', zuletztGeaendert: rel(-20), text: vertraulichkeit },
    { id: uid('vl'), kategorie: 'vertraege', name: 'Lizenzvertrag (Patent)', typ: 'Vertrag', zuletztGeaendert: rel(-20), text: lizenzvertrag },
    { id: uid('vl'), kategorie: 'vertraege', name: 'Mandatsvereinbarung', typ: 'Vertrag', zuletztGeaendert: rel(-30), text: mandatsvereinbarung },
  ]
}
export const kanzleiVorlagen = vorlagen
export const kanzleiVorlagenBeratung: Vorlage[] = vorlagen()

// ---------- Projekte ----------
function aufgabe(o: Partial<Aufgabe> & Pick<Aufgabe, 'titel'>): Aufgabe {
  return {
    id: uid('auf'), status: 'offen', prioritaet: 'Mittel', unterPrio: null, startDatum: null, kunde: null, abteilung: null,
    zustaendig: null, naechsterSchritt: null, fragen: null, benoetigteInfos: null, geplanteZeitStunden: null, istZeitStunden: null,
    umsatzEuro: null, wiedervorlage: null, erledigtAm: null, protokoll: null, taskvorschlaege: null, fuerClaude: false, ...o,
  }
}

export const kanzleiProjekte: Projekt[] = [
  {
    id: 'proj1', bereich: 'beratung', name: 'Schutzrechtsstrategie Winkelmann Sensorik', kind: 'kunde', status: 'in_arbeit', prioritaet: 'Hoch',
    verantwortlich: JH, aktuelleAufgabe: 'EP-Nachanmeldung einreichen', verknuepftKundeId: 'k5',
    meilensteine: [
      { id: 'm1', titel: '1. Recht', eta: rel(2), sortOrder: 1, aufgaben: [
        aufgabe({ titel: 'EP-Nachanmeldung einreichen (Prioritätsfrist)', status: 'in_arbeit', prioritaet: 'Hoch', kunde: 'Winkelmann Sensorik AG', zustaendig: JH, wiedervorlage: rel(0) }),
        aufgabe({ titel: 'US-Anmeldung über Partnerkanzlei beauftragen', prioritaet: 'Hoch', kunde: 'Winkelmann Sensorik AG', zustaendig: LS, wiedervorlage: rel(1) }),
        aufgabe({ titel: 'Marke „WINSENS“ für die Produktlinie prüfen', kunde: 'Winkelmann Sensorik AG', zustaendig: LS, status: 'erledigt', erledigtAm: rel(-5) }),
      ] },
      { id: 'm2', titel: '2. Wirtschaft', eta: rel(21), sortOrder: 2, aufgaben: [
        aufgabe({ titel: 'Schutzrechtswert und Lizenzpotenzial abschätzen', kunde: 'Winkelmann Sensorik AG', zustaendig: JH, wiedervorlage: rel(7) }),
        aufgabe({ titel: 'Länderauswahl nach Absatzmärkten und Kosten festlegen', kunde: 'Winkelmann Sensorik AG', zustaendig: JH, status: 'erledigt', erledigtAm: rel(-9) }),
        aufgabe({ titel: 'Budget für Jahresgebühren der nächsten 5 Jahre aufstellen', kunde: 'Winkelmann Sensorik AG', zustaendig: LS, wiedervorlage: rel(12) }),
      ] },
      { id: 'm3', titel: '3. Technik', eta: rel(45), sortOrder: 3, aufgaben: [
        aufgabe({ titel: 'Zwei weitere Erfindungen aus der Entwicklung erfassen', kunde: 'Winkelmann Sensorik AG', zustaendig: MW, wiedervorlage: rel(10) }),
        aufgabe({ titel: 'Wettbewerberpatente monatlich überwachen', kunde: 'Winkelmann Sensorik AG', zustaendig: MW, wiedervorlage: rel(14) }),
      ] },
    ],
  },
  {
    id: 'proj2', bereich: 'beratung', name: 'Freiheit zur Ausübung prüfen – Spindel Amberger', kind: 'kunde', status: 'in_arbeit', prioritaet: 'Hoch',
    verantwortlich: JH, aktuelleAufgabe: 'Verletzungsrecherche', verknuepftKundeId: 'k7',
    meilensteine: [
      { id: 'm3', titel: 'Verletzungsrecherche', eta: rel(10), sortOrder: 1, aufgaben: [
        aufgabe({ titel: 'Recherche in DE, EP und US Patentdatenbanken', status: 'in_arbeit', prioritaet: 'Hoch', kunde: 'Amberger Feinmechanik GmbH', zustaendig: LS, wiedervorlage: rel(-1), geplanteZeitStunden: 8, istZeitStunden: 5 }),
        aufgabe({ titel: 'Treffer bewerten (Merkmalsvergleich)', prioritaet: 'Hoch', kunde: 'Amberger Feinmechanik GmbH', zustaendig: MW, wiedervorlage: rel(4), geplanteZeitStunden: 10 }),
        aufgabe({ titel: 'Gutachten mit Ampelbewertung schreiben', kunde: 'Amberger Feinmechanik GmbH', zustaendig: JH, wiedervorlage: rel(9), umsatzEuro: 6500 }),
      ] },
    ],
  },
  {
    id: 'proj3', bereich: 'betriebsuebergabe', name: 'Verletzungsklage Wendt ./. Druckmaschinen Nord', kind: 'kunde', status: 'in_arbeit', prioritaet: 'Hoch',
    verantwortlich: MW, aktuelleAufgabe: 'Replik schreiben', verknuepftKundeId: 'b4',
    meilensteine: [
      { id: 'm4', titel: 'Schriftsätze', eta: rel(5), sortOrder: 1, aufgaben: [
        aufgabe({ titel: 'Replik an Landgericht schreiben', status: 'in_arbeit', prioritaet: 'Hoch', kunde: 'Wendt Drucktechnik GmbH', zustaendig: MW, wiedervorlage: rel(0) }),
        aufgabe({ titel: 'Privatgutachten zur Verletzung beauftragen', kunde: 'Wendt Drucktechnik GmbH', zustaendig: JH, wiedervorlage: rel(3) }),
        aufgabe({ titel: 'Anlagenkonvolut zusammenstellen', kunde: 'Wendt Drucktechnik GmbH', zustaendig: LS, wiedervorlage: rel(4) }),
      ] },
    ],
  },
  {
    id: 'proj4', bereich: 'beratung', name: 'Fristenkontrolle und Jahresgebühren 2027', kind: 'eigen', status: 'geplant', prioritaet: 'Mittel',
    verantwortlich: LS, aktuelleAufgabe: 'Gebührenliste prüfen',
    meilensteine: [
      { id: 'm5', titel: 'Jahreswechsel', eta: rel(30), sortOrder: 1, aufgaben: [
        aufgabe({ titel: 'Alle Jahresgebühren Januar bis März zusammenstellen', zustaendig: LS, wiedervorlage: rel(-3) }),
        aufgabe({ titel: 'Mandanten über fällige Verlängerungen informieren', zustaendig: LS, wiedervorlage: rel(7) }),
        aufgabe({ titel: 'Zweite Fristenkontrolle einrichten', zustaendig: JH, status: 'erledigt', erledigtAm: rel(-2) }),
      ] },
    ],
  },
  {
    id: 'proj5', bereich: 'beratung', name: 'Kanzleistart: laufende Akten übernehmen', kind: 'eigen', status: 'in_arbeit', prioritaet: 'Hoch',
    verantwortlich: JH, aktuelleAufgabe: 'Vollmachten DPMA/EPA umschreiben',
    meilensteine: [
      { id: 'm6', titel: 'Fristen sichern', eta: rel(3), sortOrder: 1, aufgaben: [
        aufgabe({ titel: 'Fristen aus Altakten in Fristenkontrolle übernehmen', status: 'erledigt', prioritaet: 'Hoch', zustaendig: LS, erledigtAm: rel(-6), protokoll: '214 Fristen übernommen, doppelt geprüft' }),
        aufgabe({ titel: 'Jahresgebühren-Übersicht prüfen', status: 'in_arbeit', prioritaet: 'Hoch', zustaendig: LS, wiedervorlage: rel(1), naechsterSchritt: 'Gebühren Dezember mit Mandanten abstimmen' }),
        aufgabe({ titel: 'Zweite Fristenkontrolle durch Anwalt einrichten', status: 'erledigt', zustaendig: JH, erledigtAm: rel(-4) }),
      ] },
      { id: 'm7', titel: 'Vertretung umstellen', eta: rel(10), sortOrder: 2, aufgaben: [
        aufgabe({ titel: 'Vollmachten DPMA/EPA auf neue Kanzlei umschreiben', status: 'in_arbeit', prioritaet: 'Hoch', zustaendig: JH, wiedervorlage: rel(0), naechsterSchritt: '31 von 48 Akten erledigt' }),
        aufgabe({ titel: 'Vertreterwechsel beim EPA für laufende Verfahren melden', zustaendig: MW, wiedervorlage: rel(4) }),
        aufgabe({ titel: 'Mandanten über neue Anschrift informieren', status: 'erledigt', zustaendig: LS, erledigtAm: rel(-2) }),
      ] },
      { id: 'm8', titel: 'Kanzleibetrieb', eta: rel(14), sortOrder: 3, aufgaben: [
        aufgabe({ titel: 'beA und elektronisches Postfach einrichten', status: 'erledigt', zustaendig: LS, erledigtAm: rel(-8) }),
        aufgabe({ titel: 'DPMAdirekt- und EPA-Zugänge auf neue Kanzlei umstellen', zustaendig: LS, wiedervorlage: rel(2) }),
        aufgabe({ titel: 'Berufshaftpflicht für Neugründung bestätigen lassen', zustaendig: JH, wiedervorlage: rel(6) }),
      ] },
    ],
  },
]

// ---------- Aufgabenlisten ----------
const ICH = 'j.sebastian@3stepsahead.de'
function todo(bereich: ToDoEintrag['bereich'], aufgabe: string, kundeProjekt: string, zustaendig: string, bis: number | null, prio = 'B', naechsteSchritte = ''): ToDoEintrag {
  return {
    id: uid('todo'), besitzerEmail: ICH, bereich, aufgabe, kundeProjekt, zustaendig, prio, naechsteSchritte,
    erledigenBis: bis === null ? undefined : rel(bis), erhaltenAm: rel(-5), erstelltAm: rel(-5),
  }
}
export const kanzleiTodos: ToDoEintrag[] = [
  todo('beratung', 'Erwiderung auf Prüfungsbescheid einreichen', 'Hoffmann Kältetechnik', MW, 2, 'A', 'Geänderte Ansprüche beifügen'),
  todo('beratung', 'EP-Nachanmeldung einreichen (Prioritätsfrist)', 'Winkelmann Sensorik', JH, 0, 'A'),
  todo('beratung', 'Jahresgebühr DE 10 2023 002 117.1 zahlen', 'Seidel Mechatronik', LS, 6, 'B'),
  todo('beratung', 'Zeichnungen beim Zeichner beauftragen', 'Kranz Medizintechnik', LS, 3, 'B'),
  todo('erben', 'Widerspruch gegen „KELLA“ einlegen', 'Keller Outdoor', LS, 1, 'A'),
  todo('erben', 'Waren- und Dienstleistungsverzeichnis abstimmen', 'Voigt Naturkosmetik', LS, 4, 'B'),
  todo('betriebsuebergabe', 'Einspruchsschrift EPA fertigstellen', 'Pfeiffer Lasersysteme', MW, 1, 'A', 'D1–D5 einarbeiten'),
  todo('betriebsuebergabe', 'Antwort auf Abmahnung entwerfen', 'Kronberg Pumpen', MW, 3, 'A'),
  todo('betriebsformen', 'Vertraulichkeitsvereinbarung versenden', 'Brückner Batteriesysteme', JH, 0, 'A'),
  todo('finanzierungen', 'Vergütung nach Lizenzanalogie berechnen', 'Andrea Schmidtke', JH, -2, 'A'),
  todo(undefined, 'Fortbildung Europäisches Patentrecht anmelden', 'Kanzlei', JH, 12, 'C'),
  todo(undefined, 'Zugang Fristenkalender EPA erneuern', 'Kanzlei', JH, 20, 'C'),
]
