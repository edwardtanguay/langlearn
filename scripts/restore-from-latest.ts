import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    console.error('DATABASE_URL is missing in environment variables.');
    process.exit(1);
  }

  const backupDir = path.join(process.cwd(), 'dev', 'backups', 'database');
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sqlite'));
  if (files.length === 0) {
    console.error('No .sqlite backups found.');
    process.exit(1);
  }

  files.sort((a, b) => fs.statSync(path.join(backupDir, b)).mtimeMs - fs.statSync(path.join(backupDir, a)).mtimeMs);

  const latestBackup = files[0];
  const backupPath = path.join(backupDir, latestBackup);

  console.log(`Restoring cards from latest backup: ${latestBackup}...`);

  const remoteClient = createClient({ url, authToken });
  const localClient = createClient({ url: `file:${backupPath}` });

  const tables = ['User', 'Tag', 'Flashcard', 'UserFlashcardActivity', 'FlashcardTag'];

  const allData: Record<string, any[]> = {};
  for (const table of tables) {
    try {
      const res = await localClient.execute(`SELECT * FROM "${table}"`);
      allData[table] = res.rows;
    } catch (e) {
      allData[table] = [];
    }
  }
  localClient.close();

  const deleteStatements = [...tables].reverse().map(table => `DELETE FROM "${table}"`);

  await remoteClient.batch([
    'PRAGMA foreign_keys = OFF;',
    ...deleteStatements,
    'PRAGMA foreign_keys = ON;'
  ]);

  const insertBatches: any[] = [];
  for (const table of tables) {
    const rows = allData[table];
    if (!rows || rows.length === 0) continue;

    const columns = Object.keys(rows[0]);
    const colStr = columns.map(c => `"${c}"`).join(', ');
    const placeholderStr = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO "${table}" (${colStr}) VALUES (${placeholderStr})`;

    for (const row of rows) {
      const args = columns.map(col => row[col]);
      insertBatches.push({ sql, args });
    }
  }

  const chunkSize = 500;
  for (let i = 0; i < insertBatches.length; i += chunkSize) {
    const chunk = insertBatches.slice(i, i + chunkSize);
    await remoteClient.batch(chunk);
  }

  // Ensure edwardtanguay@gmail.com is role 'admin'
  await remoteClient.execute(`UPDATE "User" SET role = 'admin' WHERE email = 'edwardtanguay@gmail.com';`);

  remoteClient.close();
  console.log(`✅ Successfully restored ${allData['Flashcard']?.length || 0} flashcards!`);
}

main().catch(console.error);
