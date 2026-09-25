import { parseBasics } from './parse-basics.js';
import { parseCorrectionJournal } from './parse-correction-journal.js';

try {
  console.log('Parsing language basics data...');
  const { categories, totalWords } = parseBasics();
  console.log(`Successfully parsed ${categories.length} categories with ${totalWords} total vocabulary items into data-parsed/basics.json`);

  console.log('Parsing correction journal data...');
  const journalResult = parseCorrectionJournal();
  console.log(`Successfully parsed ${journalResult.days.length} days with ${journalResult.totalSections} sections (${journalResult.totalWords} words, ${journalResult.totalFlashcards} flashcards) into data-parsed/correction-journal.json`);
} catch (error) {
  console.error('Error parsing data:', error);
  process.exit(1);
}
