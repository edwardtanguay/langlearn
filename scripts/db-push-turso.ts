import 'dotenv/config'
import { execSync } from 'child_process'
import { createClient } from '@libsql/client'

async function main() {
  const url = process.env.DATABASE_URL
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (!url) {
    throw new Error('DATABASE_URL is not defined in .env')
  }

  console.log('Generating DDL from schema.prisma using Prisma Engine...')
  
  // Use Prisma CLI to generate exact DDL SQL script from schema.prisma
  const sqlScript = execSync(
    'npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script',
    { encoding: 'utf-8' }
  )

  console.log('Connecting to Turso database:', url)

  const client = createClient({
    url: url,
    authToken: authToken
  })

  // Execute statements safely (idempotent)
  const statements = sqlScript
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const stmt of statements) {
    const safeStmt = stmt
      .replace(/^CREATE TABLE /i, 'CREATE TABLE IF NOT EXISTS ')
      .replace(/^CREATE UNIQUE INDEX /i, 'CREATE UNIQUE INDEX IF NOT EXISTS ')
      .replace(/^CREATE INDEX /i, 'CREATE INDEX IF NOT EXISTS ')

    try {
      await client.execute(safeStmt)
    } catch (err: any) {
      if (!err?.message?.includes('already exists') && !err?.message?.includes('duplicate column')) {
        console.warn('Notice:', err?.message || err)
      }
    }
  }

  // Ensure versionCategoryId column exists on VersionItem table
  try {
    await client.execute('ALTER TABLE VersionItem ADD COLUMN versionCategoryId TEXT REFERENCES VersionCategory(id) ON DELETE SET NULL;')
  } catch (err: any) {
    if (!err?.message?.includes('duplicate column')) {
      console.warn('Column notice:', err?.message || err)
    }
  }

  // Ensure rank column exists on VersionCategory table
  try {
    await client.execute('ALTER TABLE VersionCategory ADD COLUMN rank REAL DEFAULT 2.5;')
  } catch (err: any) {
    if (!err?.message?.includes('duplicate column')) {
      console.warn('Column notice:', err?.message || err)
    }
  }

  console.log('✅ Turso database successfully migrated with latest Prisma schema!')
  client.close()
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
