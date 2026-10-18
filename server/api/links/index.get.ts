import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const links = await prisma.link.findMany({
    orderBy: [
      { language: 'asc' },
      { rank: 'desc' },
      { title: 'asc' }
    ]
  })
  return links
})
