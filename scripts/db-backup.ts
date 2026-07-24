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
  
  if (url.startsWith('file:')) {
    console.warn('DATABASE_URL is a local file. This backup script is for remote databases.');
    process.exit(0);
  }

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  
  const backupDir = path.join(process.cwd(), 'dev', 'backups', 'database');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Query flashcard count from remote database
  let flashcardCount = 0;
  try {
    const remoteDb = createClient({ url, authToken });
    const countRes = await remoteDb.execute('SELECT COUNT(*) as count FROM Flashcard');
    if (countRes.rows.length > 0 && countRes.rows[0].count !== undefined) {
      flashcardCount = Number(countRes.rows[0].count);
    }
    remoteDb.close();
  } catch (e) {
    console.warn('Could not query remote flashcard count:', e);
  }

  const filename = `langlearn-data-${timestamp}-${flashcardCount}cards.sqlite`;
  const filePath = path.join(backupDir, filename);

  console.log(`Starting backup to ${filePath}...`);
  
  const backupClient = createClient({
    url: `file:${filePath}`,
    syncUrl: url,
    authToken: authToken
  });

  await backupClient.sync();
  backupClient.close();
  
  // The .sqlite-info file is only used by LibSQL for tracking future syncs.
  // Since this is a one-time backup, we can safely delete it so it doesn't clutter the directory.
  const infoFile = filePath + '-info';
  if (fs.existsSync(infoFile)) {
    fs.unlinkSync(infoFile);
  }
  
  console.log('Merging WAL files into a single standalone .sqlite file...');
  const localDb = createClient({ url: `file:${filePath}` });
  try {
    await localDb.execute('PRAGMA wal_checkpoint(TRUNCATE)');
  } catch (e) {
    console.warn('Could not force WAL checkpoint:', e);
  }
  localDb.close();
  
  // Cleanup any orphaned .tmp files that LibSQL might leave behind if a previous run crashed
  try {
    const files = fs.readdirSync(backupDir);
    for (const file of files) {
      if (file.startsWith('.tmp')) {
        fs.unlinkSync(path.join(backupDir, file));
      }
    }
  } catch (e) {
    console.warn('Could not clean up .tmp files:', e);
  }
  
  console.log('✅ Backup successful!');
}

main().catch(console.error);
