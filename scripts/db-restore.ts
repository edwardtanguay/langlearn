import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    console.error('DATABASE_URL is missing in environment variables.');
    process.exit(1);
  }

  if (url.startsWith('file:')) {
    console.warn('DATABASE_URL is a local file. This restore script is for remote databases.');
    process.exit(0);
  }

  const backupDir = path.join(process.cwd(), 'dev', 'backups', 'database');
  if (!fs.existsSync(backupDir)) {
    console.error(`Backup directory not found at ${backupDir}`);
    process.exit(1);
  }

  // Find the latest backup file
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sqlite'));
  if (files.length === 0) {
    console.error('No .sqlite backups found.');
    process.exit(1);
  }

  // Sort files descending by modification time
  files.sort((a, b) => {
    return fs.statSync(path.join(backupDir, b)).mtimeMs - fs.statSync(path.join(backupDir, a)).mtimeMs;
  });

  const latestBackup = files[0];
  const backupPath = path.join(backupDir, latestBackup);

  console.log(`Found latest backup: ${latestBackup}`);
  console.log('Connecting to remote database...');

  const remoteClient = createClient({ url, authToken });

  // Ask for confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

  // Extract date from filename for the prompt
  // langlearn-data-YYYY-MM-DD-HH-mm-ss-...
  const dateMatch = latestBackup.match(/langlearn-data-(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/);
  const backupDate = dateMatch ? dateMatch[1] : 'unknown date';

  console.log(`\nYou are about to replace the current database with a backup from ${backupDate}.`);
  const answer = await question('Proceed? (y/N): ');
  rl.close();

  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('Restore cancelled.');
    remoteClient.close();
    process.exit(0);
  }

  console.log('Connecting to local backup database...');
  const localClient = createClient({ url: `file:${backupPath}` });

  // List of tables in correct insertion order (parent -> child)
  // For deletion, we'll reverse this order.
  const tables = [
    'User',
    'Tag',
    'Flashcard',
    'UserFlashcardActivity',
    'FlashcardTag'
  ];

  console.log('Extracting data from backup...');
  
  // Extract all rows for each table
  const allData: Record<string, any[]> = {};
  for (const table of tables) {
    try {
      const res = await localClient.execute(`SELECT * FROM "${table}"`);
      allData[table] = res.rows;
    } catch (e) {
      console.warn(`Table ${table} not found or error extracting:`, e);
      allData[table] = [];
    }
  }
  
  localClient.close();

  console.log('Emptying remote tables...');
  
  const deleteStatements = [...tables].reverse().map(table => `DELETE FROM "${table}"`);
  
  try {
    // Disable foreign keys temporarily and delete
    await remoteClient.batch([
      'PRAGMA foreign_keys = OFF;',
      ...deleteStatements,
      'PRAGMA foreign_keys = ON;'
    ]);
  } catch (err) {
    console.error('Failed to empty tables:', err);
    remoteClient.close();
    process.exit(1);
  }

  console.log('Inserting backed-up data into remote database...');
  
  // Create insert batches
  const insertBatches: any[] = [];
  
  for (const table of tables) {
    const rows = allData[table];
    if (!rows || rows.length === 0) continue;
    
    // We get the columns from the first row
    const columns = Object.keys(rows[0]);
    const colStr = columns.map(c => `"${c}"`).join(', ');
    const placeholderStr = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO "${table}" (${colStr}) VALUES (${placeholderStr})`;
    
    for (const row of rows) {
      const args = columns.map(col => row[col]);
      insertBatches.push({ sql, args });
    }
  }

  // We should execute them in smaller chunks if there are thousands of rows, 
  // but LibSQL batch has a limit. Let's chunk by 500 statements.
  const chunkSize = 500;
  for (let i = 0; i < insertBatches.length; i += chunkSize) {
    const chunk = insertBatches.slice(i, i + chunkSize);
    console.log(`Inserting chunk ${i / chunkSize + 1} of ${Math.ceil(insertBatches.length / chunkSize)}...`);
    try {
      await remoteClient.batch(chunk);
    } catch (err) {
      console.error(`Failed to insert chunk starting at index ${i}:`, err);
      // Don't exit here immediately, maybe let user know
      process.exit(1);
    }
  }

  remoteClient.close();
  console.log('✅ Restore completed successfully!');
}

main().catch(console.error);
