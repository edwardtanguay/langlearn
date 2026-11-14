import { prisma } from '../../utils/prisma'

const STARTER_HOWTO_ITEMS = [
  {
    title: 'Assign a High Priority Rank with //498',
    description:
      'Add //498 to a phrase in Google Translate before importing. The importer parses "//" followed by digits into a 0.0–5.0 rank (so //498 becomes 4.98), putting your most useful phrases at the top of "Most important unlearned".',
    rank: 4.98,
    slug: 'test001'
  },
  {
    title: 'Add Pronunciation & Memory Hooks Inline',
    description:
      'Use //p.<pronunciation> (for example //p.oh fyoor) and //m.<memory hook> (for example //m.sounds like fur) right inside your saved Google Translate phrase so they populate the back of your flashcard automatically.',
    rank: 4.6,
    slug: 'addPronunciationAndHook'
  },
  {
    title: 'Tag Phrases with //t.de or //t.a',
    description:
      'Append //t.de or //t.a when saving a phrase to automatically tag the imported card ("a" is converted to "à"). Tagged cards appear in the "Phrases with à/de" flashcard mode and the "Learn à/de" activity.',
    rank: 4.3,
    slug: 'addTagToPhrase'
  },
  {
    title: 'Highlight Key Words with *Asterisks*',
    description:
      'Wrap the core word or expression in asterisks like "Il fait *beau* aujourd\'hui". This unlocks the "3 examples" button on the card back and feeds the Drag/Drop Highlighted Words activity.',
    rank: 4.1,
    slug: 'highlightTargetWord'
  }
]

export default defineEventHandler(async () => {
  try {
    const existingCount = await prisma.howtoItem.count()
    if (existingCount === 0) {
      for (const item of STARTER_HOWTO_ITEMS) {
        await prisma.howtoItem.upsert({
          where: { slug: item.slug },
          update: {},
          create: item
        })
      }
    }
  } catch (err) {
    console.error('Failed to auto-seed howtoItems:', err)
  }

  const items = await prisma.howtoItem.findMany({
    orderBy: [
      { rank: 'desc' },
      { createdAt: 'asc' }
    ]
  })

  return items.map((item) => ({
    ...item,
    imageUrl: item.imageFileMain ? `/images/howtos/${item.imageFileMain}` : null,
    thumbUrl: item.imageFileThumb ? `/images/howtos/${item.imageFileThumb}` : null
  }))
})

