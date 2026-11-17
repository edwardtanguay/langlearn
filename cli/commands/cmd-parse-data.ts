import 'dotenv/config';
import { parseBasics } from './parse-basics.js';
import { parseCorrectionJournal } from './parse-correction-journal.js';
import { parseSpanishVerbs } from './parse-spanish-verbs.js';
import { parseItalianVerbs } from './parse-italian-verbs.js';
import { parseSubjunctive } from './parse-subjunctive.js';
import { syncScreenshots } from './sync-screenshots.js';

async function main() {
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

    console.log('Parsing Italian verbs data...');
    const italianVerbsResult = parseItalianVerbs();
    console.log(`Successfully parsed ${italianVerbsResult.totalVerbs} Italian verbs into data-parsed/italian-verbs.json`);

    console.log('Parsing Spanish subjunctive data...');
    const subjunctiveResult = parseSubjunctive();
    console.log(`Successfully parsed ${subjunctiveResult.totalItems} subjunctive items into data-parsed/subjunctive-items.json`);

    console.log('Syncing screenshots for howtos and links...');
    const syncResult = await syncScreenshots();
    console.log(`Successfully synced screenshots (${syncResult.howtosUpdated} howtos updated, ${syncResult.linksUpdated} links updated)`);
  } catch (error) {
    console.error('Error parsing data:', error);
    process.exit(1);
  }
}

main();
