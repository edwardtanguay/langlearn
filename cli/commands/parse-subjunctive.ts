import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export interface SubjunctiveItem {
  english: string;
  spanish: string;
  indicative: string;
  subjunctive: string;
}

export function parseSubjunctive(): { items: SubjunctiveItem[]; totalItems: number } {
  const filePath = path.join(projectRoot, 'data', 'bits', 'es-learnbits.txt');
  const parsedDir = path.join(projectRoot, 'data-parsed');

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  let inSection = false;
  const items: SubjunctiveItem[] = [];

  let currentEnglish = '';
  let currentSpanish = '';
  let currentIndicative = '';

  for (const line of lines) {
    if (line.startsWith('- ')) {
      const sectionName = line.slice(2).trim().toLowerCase();
      if (sectionName === 'subjunctive trigger phrases') {
        inSection = true;
      } else if (inSection) {
        break;
      }
      continue;
    }

    if (!inSection) continue;

    // 4 tabs: subjunctive
    const match4 = line.match(/^\t{4}-\s+(.*)$/);
    if (match4) {
      const subjunctive = match4[1].trim();
      if (currentEnglish && currentSpanish && currentIndicative && subjunctive) {
        items.push({
          english: currentEnglish,
          spanish: currentSpanish,
          indicative: currentIndicative,
          subjunctive,
        });
      }
      continue;
    }

    // 3 tabs: indicative
    const match3 = line.match(/^\t{3}-\s+(.*)$/);
    if (match3) {
      currentIndicative = match3[1].trim();
      continue;
    }

    // 2 tabs: spanish
    const match2 = line.match(/^\t{2}-\s+(.*)$/);
    if (match2) {
      currentSpanish = match2[1].trim();
      currentIndicative = '';
      continue;
    }

    // 1 tab: english
    const match1 = line.match(/^\t{1}-\s+(.*)$/);
    if (match1) {
      currentEnglish = match1[1].trim();
      currentSpanish = '';
      currentIndicative = '';
    }
  }

  if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir, { recursive: true });
  }

  const outputPath = path.join(parsedDir, 'subjunctive-items.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8');

  return { items, totalItems: items.length };
}
