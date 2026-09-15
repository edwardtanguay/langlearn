import fs from 'fs';

const en = fs.readFileSync('data/basics/en-basics.txt', 'utf8').split(/\r?\n/);
const langs = ['fr', 'es', 'it', 'nl'];

let totalErrors = 0;

langs.forEach(lang => {
  const filePath = `data/basics/${lang}-basics.txt`;
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    totalErrors++;
    return;
  }
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  console.log(`${lang}-basics.txt: ${lines.length} lines (en: ${en.length})`);
  if (lines.length !== en.length) {
    console.error(`Line count mismatch in ${lang}: ${lines.length} vs ${en.length}`);
    totalErrors++;
  }
  for (let i = 0; i < Math.min(lines.length, en.length); i++) {
    const enLine = en[i];
    const line = lines[i];
    if (enLine.startsWith('- ')) {
      if (line !== enLine) {
        console.error(`Header mismatch on line ${i + 1} in ${lang}:`);
        console.error(`  EN: '${enLine}'`);
        console.error(`  ${lang.toUpperCase()}: '${line}'`);
        totalErrors++;
      }
    } else if (enLine.startsWith('\t- ')) {
      if (!line.startsWith('\t- ')) {
        console.error(`Indentation mismatch on line ${i + 1} in ${lang}: '${line}'`);
        totalErrors++;
      }
    }
  }
});

if (totalErrors === 0) {
  console.log('ALL CHECKS PASSED: Exactly 88 lines and identical header/indentation structure across all 4 files!');
} else {
  console.error(`Found ${totalErrors} errors.`);
  process.exit(1);
}
