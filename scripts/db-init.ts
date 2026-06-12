import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url) {
  console.error('DATABASE_URL is not defined in the environment.')
  process.exit(1)
}

const client = createClient({
  url,
  authToken,
})

async function init() {
  console.log('Connecting to Turso database to initialize schema...')
  
  try {
    // Create DbTest table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "DbTest" (
        "id" INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
        "status" TEXT NOT NULL DEFAULT 'off',
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✔ DbTest table verified/created.')

    // Ensure default DbTest record exists
    await client.execute(`
      INSERT OR IGNORE INTO "DbTest" ("id", "status") VALUES (1, 'off');
    `)
    console.log('✔ Default DbTest record verified.')

    // Create Task table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✔ Task table verified/created.')
    
    console.log('🎉 Database initialization complete!')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

init()
