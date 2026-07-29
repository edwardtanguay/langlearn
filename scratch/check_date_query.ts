import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function testDateQuery() {
  const user = await prisma.user.findFirst()
  if (!user) return

  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  console.log('Current time:', now.toISOString())
  console.log('24h ago:', twentyFourHoursAgo.toISOString())

  const poolNewToday = await prisma.flashcard.findMany({
    where: {
      ownerId: user.id,
      status: 'LEARNING',
      nextTestTime: null,
      createdAt: { gte: twentyFourHoursAgo }
    },
    take: 10
  })

  console.log(`\nCards returned by gte 24h ago count: ${poolNewToday.length}`)
  poolNewToday.forEach(c => {
    console.log(`- ID: ${c.id} | CreatedAt: ${c.createdAt?.toISOString?.() || c.createdAt} | Front: "${c.front}"`)
  })

  const sampleCard = await prisma.flashcard.findFirst({
    where: { status: 'LEARNING', nextTestTime: null }
  })
  console.log('\nSample card createdAt raw:', sampleCard?.createdAt, 'Type:', typeof sampleCard?.createdAt)
}

testDateQuery().finally(() => prisma.$disconnect())
