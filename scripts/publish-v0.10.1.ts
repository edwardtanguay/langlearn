import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { parseAndAssignCategories } from '../server/utils/categoryParser'

async function main() {
  console.log('Publishing version 0.10.1 in database...')

  let v = await prisma.version.findUnique({
    where: { versionNumber: '0.10.1' },
    include: { versionItems: true }
  })

  if (!v) {
    v = await prisma.version.create({
      data: {
        versionNumber: '0.10.1',
        title: 'Necessary Changes for Member Import',
        status: 'PUBLISHED',
        publishDate: new Date()
      },
      include: { versionItems: true }
    })
    console.log('Created version 0.10.1:', v.id)
  } else {
    v = await prisma.version.update({
      where: { id: v.id },
      data: {
        title: 'Necessary Changes for Member Import',
        status: 'PUBLISHED',
        publishDate: v.publishDate || new Date()
      },
      include: { versionItems: true }
    })
    console.log('Updated existing version 0.10.1:', v.id)
  }

  const items = [
    {
      type: 'BUG-FIX',
      body: 'Import Page: Instead of looking for only English names of languages in the import text (English, German, Spanish, etc.) we now look for names of languages in any language, e.g. also "Englisch, Deutsch, Spanisch). Support the spellings in 5 languages for now: English, German, French, Spanish, Italian. If there is any undefined name of a language, then skip that entry and reported it as a skipped card with an appropriate reason, e.g. "Spaans not identifiable as a language".',
      isTested: true,
      orderWithinVersion: 1
    },
    {
      type: 'BUG-FIX',
      body: 'Import Page: As much as possible, the desktop import process now has assumed all the features of the mobile import process. The only difference is that the desktop process uploads a CSV file from the local file system, while the mobile version pastes in text, but otherwise, the import process is the same, i.e. the way it was in mobile.',
      isTested: true,
      orderWithinVersion: 2
    },
    {
      type: 'FEATURE',
      body: 'Language Basics Activity: Added to the section Colors: silver, gold, bronze.',
      isTested: true,
      orderWithinVersion: 3
    },
    {
      type: 'FEATURE',
      body: 'Language Basics Activity: The app now remembers which language the user was using, saving it in localstorage, so when they return the page, the same language is showing as when they left.',
      isTested: true,
      orderWithinVersion: 4
    },
    {
      type: 'FEATURE',
      body: 'Language Basics Activity: For the Dutch language, changed the pronunciation of "y" to "ee-grehk".',
      isTested: true,
      orderWithinVersion: 5
    },
    {
      type: 'FEATURE',
      body: 'Language Basics Activity: Added a section "Frequency" with 10 words like: always, usually, often, sometimes, rarely, seldom, never.',
      isTested: true,
      orderWithinVersion: 6
    }
  ]

  for (const item of items) {
    const existing = await prisma.versionItem.findFirst({
      where: {
        versionId: v.id,
        body: item.body
      }
    })

    if (!existing) {
      await prisma.versionItem.create({
        data: {
          versionId: v.id,
          type: item.type,
          body: item.body,
          isTested: item.isTested,
          orderWithinVersion: item.orderWithinVersion
        }
      })
      console.log('Added version item:', item.body.slice(0, 60))
    }
  }

  console.log('Running category assignment...')
  await parseAndAssignCategories()
  console.log('✅ Version 0.10.1 successfully registered!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Error publishing version 0.10.1:', err)
  process.exit(1)
})
