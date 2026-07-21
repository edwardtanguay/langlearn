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


    // Create User table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "minutesToTestAgain" INTEGER NOT NULL DEFAULT 10
      );
    `)
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `)
    console.log('✔ User table and email index verified/created.')

    // Create Flashcard table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Flashcard" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "ownerId" TEXT NOT NULL,
        "front" TEXT NOT NULL,
        "back" TEXT NOT NULL,
        "frontLanguage" TEXT NOT NULL,
        "backLanguage" TEXT NOT NULL,
        "pronunciation" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'LEARNING',
        "rank" REAL NOT NULL DEFAULT 2.5,
        "memoryHook" TEXT,
        "copiedFromId" TEXT,
        FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("copiedFromId") REFERENCES "Flashcard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)
    console.log('✔ Flashcard table verified/created.')

    // Create UserFlashcardActivity table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "UserFlashcardActivity" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "flashcardId" TEXT NOT NULL,
        "whenActedUpon" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "actionTaken" TEXT NOT NULL,
        "actionDetails" TEXT,
        FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)
    console.log('✔ UserFlashcardActivity table verified/created.')

    // Create Tag table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Tag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "abbreviation" TEXT NOT NULL,
        "description" TEXT
      );
    `)
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Tag_abbreviation_key" ON "Tag"("abbreviation");
    `)
    console.log('✔ Tag table and index verified/created.')

    // Create FlashcardTag table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "FlashcardTag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "flashcardId" TEXT NOT NULL,
        "tagId" TEXT NOT NULL,
        FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "FlashcardTag_flashcardId_tagId_key" ON "FlashcardTag"("flashcardId", "tagId");
    `)
    console.log('✔ FlashcardTag table and unique index verified/created.')
    
    console.log('🎉 Database initialization complete!')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

init()

