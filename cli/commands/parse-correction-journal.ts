import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export interface TextBit {
  type: 'text';
  text: string;
}

export interface FlashcardBit {
  type: 'flashcard';
  id: string;
  incorrect: string;
  correct: string;
}

export type SectionBit = TextBit | FlashcardBit;

export interface JournalSection {
  id: string;
  day: string;
  sectionIndex: number;
  language: string;
  rawText: string;
  bits: SectionBit[];
  flashcardsCount: number;
  wordCount: number;
}

export interface DayGroup {
  date: string;
  sections: JournalSection[];
  totalWords: number;
  totalFlashcards: number;
}

export interface CorrectionJournalParsed {
  days: DayGroup[];
  totalSections: number;
  totalWords: number;
  totalFlashcards: number;
}

export function parseBitsFromText(text: string, sectionId: string): { bits: SectionBit[]; flashcardsCount: number } {
  const bits: SectionBit[] = [];
  const regex = /\[([^;\]]+);([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let fcIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      bits.push({
        type: 'text',
        text: text.slice(lastIndex, match.index)
      });
    }

    fcIndex++;
    bits.push({
      type: 'flashcard',
      id: `${sectionId}-fc-${fcIndex}`,
      incorrect: match[1]!.trim(),
      correct: match[2]!.trim()
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    bits.push({
      type: 'text',
      text: text.slice(lastIndex)
    });
  }

  return {
    bits,
    flashcardsCount: fcIndex
  };
}

export function countWords(text: string): number {
  // Strip out flashcard brackets syntax but keep the text
  const clean = text.replace(/\[([^;\]]+);([^\]]+)\]/g, '$2').trim();
  if (!clean) return 0;
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

export function parseCorrectionJournal(filePath?: string): CorrectionJournalParsed {
  const targetPath = filePath || path.join(projectRoot, 'data', 'correction-journal.dpod.txt');
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Correction journal file not found at: ${targetPath}`);
  }

  const content = fs.readFileSync(targetPath, 'utf8');
  const lines = content.split(/\r?\n/);

  const daysMap = new Map<string, JournalSection[]>();
  let currentDay = '';
  let currentLang = 'fr';
  let currentSectionLines: string[] = [];
  let inSection = false;
  let globalSectionIdx = 0;

  const flushSection = () => {
    if (!currentDay) return;
    const rawText = currentSectionLines.join('\n').trim();
    if (!rawText) {
      currentSectionLines = [];
      return;
    }

    globalSectionIdx++;
    const daySections = daysMap.get(currentDay) || [];
    const sectionIndex = daySections.length + 1;
    const sectionId = `${currentDay}-sec-${sectionIndex}`;

    const { bits, flashcardsCount } = parseBitsFromText(rawText, sectionId);
    const wordCount = countWords(rawText);

    const section: JournalSection = {
      id: sectionId,
      day: currentDay,
      sectionIndex,
      language: currentLang,
      rawText,
      bits,
      flashcardsCount,
      wordCount
    };

    daySections.push(section);
    daysMap.set(currentDay, daySections);

    currentSectionLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Check for date header e.g. 2026-09-23
    const dateMatch = line.trim().match(/^(\d{4}-\d{2}-\d{2})$/);
    if (dateMatch) {
      flushSection();
      currentDay = dateMatch[1]!;
      currentLang = 'fr';
      inSection = false;
      continue;
    }

    // Check for separator e.g. --- or ---de
    if (line.trim().startsWith('---')) {
      flushSection();
      const langSuffix = line.trim().slice(3).trim();
      currentLang = langSuffix || 'fr';
      inSection = true;
      continue;
    }

    if (inSection && currentDay) {
      currentSectionLines.push(line);
    }
  }

  // Flush any remaining section at end of file
  flushSection();

  const days: DayGroup[] = [];
  let totalSections = 0;
  let totalWords = 0;
  let totalFlashcards = 0;

  for (const [date, sections] of daysMap.entries()) {
    const dayWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
    const dayFlashcards = sections.reduce((sum, s) => sum + s.flashcardsCount, 0);

    days.push({
      date,
      sections,
      totalWords: dayWords,
      totalFlashcards: dayFlashcards
    });

    totalSections += sections.length;
    totalWords += dayWords;
    totalFlashcards += dayFlashcards;
  }

  const result: CorrectionJournalParsed = {
    days,
    totalSections,
    totalWords,
    totalFlashcards
  };

  // Ensure output directory exists and write JSON
  const outputDir = path.join(projectRoot, 'data-parsed');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'correction-journal.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

  return result;
}
