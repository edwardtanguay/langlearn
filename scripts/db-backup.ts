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
  
  // Clean sidecar files (.sqlite-wal, .sqlite-shm, .sqlite-info)
  const sidecars = [filePath + '-wal', filePath + '-shm', filePath + '-info'];
  for (const sidecar of sidecars) {
    if (fs.existsSync(sidecar)) {
      try {
        fs.unlinkSync(sidecar);
      } catch (e) {
        // Ignore if locked
      }
    }
  }

  // Clean orphaned .tmp, -wal, -shm files across backup directory
  try {
    const files = fs.readdirSync(backupDir);
    for (const file of files) {
      if (file.startsWith('.tmp') || file.endsWith('-wal') || file.endsWith('-shm') || file.endsWith('-info')) {
        try {
          fs.unlinkSync(path.join(backupDir, file));
        } catch (e) {
          // Ignore locked files
        }
      }
    }
  } catch (e) {
    console.warn('Could not clean up sidecar files:', e);
  }

  
  console.log('✅ Backup successful!');
}

main().catch(console.error);
