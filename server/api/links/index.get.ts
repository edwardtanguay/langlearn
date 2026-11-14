import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const existingActivity = await prisma.link.findFirst({
      where: { url: 'https://language-learning-activities.vercel.app' }
    })
    if (!existingActivity) {
      await prisma.link.create({
        data: {
          language: 'general',
          title: 'Language Learning Activities',
          url: 'https://language-learning-activities.vercel.app',
          description: 'General language learning activities and exercises',
          rank: 3.0
        }
      })
    }

    const existingPrince = await prisma.link.findFirst({
      where: { url: 'https://trilingual-little-prince.vercel.app' }
    })
    if (!existingPrince) {
      await prisma.link.create({
        data: {
          language: 'general',
          title: 'Trilingual Little Prince',
          url: 'https://trilingual-little-prince.vercel.app',
          description: 'Read The Little Prince in three languages simultaneously',
          rank: 2.8
        }
      })
    }
  } catch (e) {
    // Gracefully handle if DB is offline or table is being created
  }

  const links = await prisma.link.findMany({
    orderBy: [
      { language: 'asc' },
      { rank: 'desc' },
      { title: 'asc' }
    ]
  })
  return links.map((link) => ({
    ...link,
    thumbUrl: link.imageFileThumb ? `/images/links/${link.imageFileThumb}` : null
  }))
})
