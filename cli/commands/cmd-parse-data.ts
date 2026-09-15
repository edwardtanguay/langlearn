import { parseBasics } from './parse-basics.js';

try {
  console.log('Parsing language basics data...');
  const { categories, totalWords } = parseBasics();
  console.log(`Successfully parsed ${categories.length} categories with ${totalWords} total vocabulary items into data-parsed/basics.json`);
} catch (error) {
  console.error('Error parsing language basics data:', error);
  process.exit(1);
}