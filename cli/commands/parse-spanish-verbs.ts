import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export interface SpanishVerb {
  verb: string;
  present: string[];
  imperfect: string[];
  preterite: string[];
  future: string[];
  conditional: string[];
  presentSubjunctive: string[];
  imperfectSubjunctive: string[];
  gerund: string;
  pastParticiple: string;
}

export function parseSpanishVerbs(): { verbs: SpanishVerb[]; totalVerbs: number } {
  const filePath = path.join(projectRoot, 'data', 'bits', 'es-learnbits.txt');
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

    // Check for top-level section headers like "- verbs" or "- classroom speak"
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

    // Check for verb definition: starts with one tab or 2-4 spaces followed by "- "
    // Example: "\t- hablar"
    const matchVerb = line.match(/^(\t|\s{2,4})-\s+([^\s]+)/);
    // Check for sub-lines: starts with two tabs or 5+ spaces followed by "- "
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

  // Filter only verbs that have all 8 lines
  const parsedVerbs: SpanishVerb[] = [];

  for (const raw of rawVerbs) {
    if (raw.lines.length !== 8) {
      continue;
    }

    const splitItems = (lineStr: string) =>
      lineStr.split(',').map(s => s.trim()).filter(Boolean);

    const present = splitItems(raw.lines[0]);
    const imperfect = splitItems(raw.lines[1]);
    const preterite = splitItems(raw.lines[2]);
    const future = splitItems(raw.lines[3]);
    const conditional = splitItems(raw.lines[4]);
    const presentSubjunctive = splitItems(raw.lines[5]);
    const imperfectSubjunctive = splitItems(raw.lines[6]);
    const nonFinite = splitItems(raw.lines[7]);

    parsedVerbs.push({
      verb: raw.verb,
      present,
      imperfect,
      preterite,
      future,
      conditional,
      presentSubjunctive,
      imperfectSubjunctive,
      gerund: nonFinite[0] || '',
      pastParticiple: nonFinite[1] || ''
    });
  }

  if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir, { recursive: true });
  }

  const outputPath = path.join(parsedDir, 'spanish-verbs.json');
  fs.writeFileSync(outputPath, JSON.stringify(parsedVerbs, null, 2), 'utf8');

  return { verbs: parsedVerbs, totalVerbs: parsedVerbs.length };
}

