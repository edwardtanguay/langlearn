import { parseBasics } from './parse-basics.js';
import { parseCorrectionJournal } from './parse-correction-journal.js';
import { parseSpanishVerbs } from './parse-spanish-verbs.js';

try {
  console.log('Parsing language basics data...');
  const { categories, totalWords } = parseBasics();
  console.log(`Successfully parsed ${categories.length} categories with ${totalWords} total vocabulary items into data-parsed/basics.json`);

  console.log('Parsing correction journal data...');
  const journalResult = parseCorrectionJournal();
  console.log(`Successfully parsed ${journalResult.days.length} days with ${journalResult.totalSections} sections (${journalResult.totalWords} words, ${journalResult.totalFlashcards} flashcards) into data-parsed/correction-journal.json`);

  console.log('Parsing Spanish verbs data...');
  const verbsResult = parseSpanishVerbs();
  console.log(`Successfully parsed ${verbsResult.totalVerbs} verbs with all 8 lines into data-parsed/spanish-verbs.json`);
} catch (error) {
  console.error('Error parsing data:', error);
  process.exit(1);
}