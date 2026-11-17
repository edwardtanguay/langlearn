import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export interface ItalianVerb {
  verb: string;
  presente: string[];
  imperfetto: string[];
  passatoProssimo: string[];
  passatoRemoto: string[];
  futuro: string[];
  condizionale: string[];
  congiuntivoPresente: string[];
  congiuntivoImperfetto: string[];
  imperativo: string[];
  gerund: string;
  pastParticiple: string;
}

export function parseItalianVerbs(): { verbs: ItalianVerb[]; totalVerbs: number } {
  const filePath = path.join(projectRoot, 'data', 'verbs', 'it-verbs.txt');
  const parsedDir = path.join(projectRoot, 'data-parsed');

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  let inVerbsSection = false;
  interface RawVerb {
    verb: string;
    lines: string[];
  }

  const rawVerbs: RawVerb[] = [];
  let currentVerb: RawVerb | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('- ')) {
      const sectionName = line.slice(2).trim();
      if (sectionName === 'verbs') {
        inVerbsSection = true;
      } else {
        inVerbsSection = false;
        if (currentVerb) {
          rawVerbs.push(currentVerb);
          currentVerb = null;
        }
      }
      continue;
    }

    if (!inVerbsSection) continue;

    const matchVerb = line.match(/^(\t|\s{2,4})-\s+([^\s]+)/);
    const matchSubLine = line.match(/^(\t\t|\s{5,8})-\s+(.*)$/);

    if (matchSubLine && currentVerb) {
      currentVerb.lines.push(matchSubLine[2].trim());
    } else if (matchVerb) {
      if (currentVerb) {
        rawVerbs.push(currentVerb);
      }
      currentVerb = {
        verb: matchVerb[2].trim(),
        lines: []
      };
    }
  }

  if (currentVerb) {
    rawVerbs.push(currentVerb);
  }

  const parsedVerbs: ItalianVerb[] = [];

  for (const raw of rawVerbs) {
    if (raw.lines.length < 9) {
      continue;
    }

    const splitItems = (lineStr: string) =>
      lineStr.split(',').map(s => s.trim()).filter(Boolean);

    const presente = splitItems(raw.lines[0]);
    const imperfetto = splitItems(raw.lines[1]);
    const passatoProssimo = splitItems(raw.lines[2]);
    const passatoRemoto = splitItems(raw.lines[3]);
    const futuro = splitItems(raw.lines[4]);
    const condizionale = splitItems(raw.lines[5]);
    const congiuntivoPresente = splitItems(raw.lines[6]);
    const congiuntivoImperfetto = splitItems(raw.lines[7]);
    const imperativo = splitItems(raw.lines[8]);
    const nonFinite = raw.lines[9] ? splitItems(raw.lines[9]) : [];

    parsedVerbs.push({
      verb: raw.verb,
      presente,
      imperfetto,
      passatoProssimo,
      passatoRemoto,
      futuro,
      condizionale,
      congiuntivoPresente,
      congiuntivoImperfetto,
      imperativo,
      gerund: nonFinite[0] || '',
      pastParticiple: nonFinite[1] || ''
    });
  }

  if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir, { recursive: true });
  }

  const outputPath = path.join(parsedDir, 'italian-verbs.json');
  fs.writeFileSync(outputPath, JSON.stringify(parsedVerbs, null, 2), 'utf8');

  return { verbs: parsedVerbs, totalVerbs: parsedVerbs.length };
}
