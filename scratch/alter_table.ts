import { PrismaClient } from '../server/prisma/client/client.js'
import { createClient } from '@libsql/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE Flashcard ADD COLUMN nextTestTime DATETIME;`)
    console.log('Successfully added nextTestTime column to Flashcard table in Turso.')
  } catch (error: any) {
    if (error.message && error.message.includes('duplicate column name')) {
      console.log('Column nextTestTime already exists.')
    } else {
      console.error('Failed to add column:', error)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
