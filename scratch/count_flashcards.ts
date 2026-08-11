import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const count = await prisma.flashcard.count({
    where: {
      OR: [
        { front: { startsWith: 'mon ami,' } },
        { back: { startsWith: 'mon ami,' } }
      ]
    }
  })
  console.log('FLASHCARD_COUNT:', count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
