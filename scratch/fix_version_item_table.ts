import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN
})

async function main() {
  console.log('Migrating VersionItem table in Turso...')
  await client.execute('PRAGMA foreign_keys=OFF;')
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "VersionItem_new" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "versionId" TEXT,
      "type" TEXT NOT NULL DEFAULT 'BUGFIX',
      "body" TEXT NOT NULL,
      "startedByUserId" TEXT,
      "orderWithinVersion" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "VersionItem_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "VersionItem_startedByUserId_fkey" FOREIGN KEY ("startedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `)

  await client.execute(`
    INSERT INTO "VersionItem_new" ("id", "versionId", "type", "body", "startedByUserId", "orderWithinVersion", "createdAt", "updatedAt")
    SELECT "id", "versionId", "type", "body", "startedByUserId", "orderWithinVersion", "createdAt", "updatedAt" FROM "VersionItem";
  `)

  await client.execute('DROP TABLE "VersionItem";')
  await client.execute('ALTER TABLE "VersionItem_new" RENAME TO "VersionItem";')
  
  await client.execute('PRAGMA foreign_keys=ON;')
  console.log('Successfully updated VersionItem table schema in Turso!')
}

main().catch(console.error)
