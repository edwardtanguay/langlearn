import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

const adapter = new PrismaLibSql({
  url: url!,
  authToken,
})
const prisma = new PrismaClient({ adapter })

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'de', name: 'German' },
  { code: 'ru', name: 'Russian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'da', name: 'Danish' },
  { code: 'el', name: 'Greek' }
]

async function seedLinks() {
  console.log('Seeding initial Links...')
  const existingCount = await prisma.link.count()
  if (existingCount > 0) {
    console.log(`Links already exist in DB (${existingCount} found). Checking for missing feature links...`)
  }

  const initialLinks = [
    // French
    {
      language: 'fr',
      title: 'Voyages Endormis',
      url: 'https://www.youtube.com/@VoyagesEndormis/videos',
      description: 'hour long intellectual spoken essays on influential thinkers of history',
      rank: 4.9
    },
    {
      language: 'fr',
      title: 'Entraînez votre oreille pour comprendre le français naturel',
      url: 'https://www.youtube.com/watch?v=LlEWRubU33k',
      description: 'Listening comprehension video for natural spoken French',
      rank: 4.5
    },
    {
      language: 'fr',
      title: '50 min French pronunciation practice of liasons',
      url: 'https://www.youtube.com/watch?v=wglgzUdEs5I',
      description: 'French liaisons pronunciation exercise and examples',
      rank: 4.5
    },
    {
      language: 'fr',
      title: '30 minutes pronunciation video with Fanny',
      url: 'https://www.youtube.com/watch?v=Bmxdtrv4uQM',
      description: 'Comprehensive guided pronunciation practice with Fanny',
      rank: 4.5
    },
    {
      language: 'fr',
      title: 'Paris Podcast Videos',
      url: 'https://www.youtube.com/@ParisPodcast1',
      description: 'Authentic conversations and podcasts from Paris',
      rank: 4.5
    },
    {
      language: 'fr',
      title: 'Cozy French',
      url: 'https://www.youtube.com/@TheCozyFrench/videos',
      description: 'Gentle, clear French listening with relaxed atmosphere',
      rank: 4.5
    },
    {
      language: 'fr',
      title: 'La Psyché Français',
      url: 'https://www.youtube.com/@LaPsych%C3%A912/videos',
      description: 'Psychology and mental reflections in native French',
      rank: 4.5
    },
    // Italian
    {
      language: 'it',
      title: 'Italiano Facile Videos',
      url: 'https://www.youtube.com/@italianofacile-u5z',
      description: 'Accessible Italian lessons and conversational practice',
      rank: 4.5
    },
    {
      language: 'it',
      title: 'Italian Express Videos',
      url: 'https://www.youtube.com/@ibo-3117/videos',
      description: 'Dynamic lessons and expressions in everyday Italian',
      rank: 4.5
    },
    // Spanish
    {
      language: 'es',
      title: 'Spanish Talks Café Videos',
      url: 'https://www.youtube.com/@SpanishTalksCaf%C3%A9/videos',
      description: 'Real-world dialogues and colloquial Spanish insights',
      rank: 4.5
    },
    {
      language: 'es',
      title: 'Easy Spanish Podcast Videos',
      url: 'https://www.youtube.com/@easyspanishpodcast3/videos',
      description: 'Conversations with native Spanish speakers from all around the world',
      rank: 4.5
    },
    // English
    {
      language: 'en',
      title: 'Reverso Verbs',
      url: 'https://conjugator.reverso.net/conjugation-english.html',
      description: 'English verb conjugation tool for all moods and tenses',
      rank: 4.5
    },
    {
      language: 'en',
      title: 'English Club Grammar',
      url: 'https://www.englishclub.com/grammar',
      description: 'Clear reference guides, quizzes, and vocabulary rules for English',
      rank: 4.5
    }
  ]

  for (const item of initialLinks) {
    const existing = await prisma.link.findFirst({
      where: { url: item.url }
    })
    if (!existing) {
      await prisma.link.create({ data: item })
      console.log(`Created link: ${item.title} (${item.language})`)
    } else {
      await prisma.link.update({
        where: { id: existing.id },
        data: item
      })
      console.log(`Updated link: ${item.title} (${item.language})`)
    }
  }
}

async function seedMissingGeminiPrompts() {
  console.log('Checking Gemini Quiz Prompts for supported languages...')
  const allPrompts = await prisma.chatbotPrompt.findMany({
    where: { category: 'geminiQuizPrompts' }
  })

  const existingLangs = new Set(allPrompts.map(p => p.language.toLowerCase()))

  for (const lang of supportedLanguages) {
    if (!existingLangs.has(lang.code)) {
      console.log(`Creating missing B1 prompt for ${lang.name} (${lang.code})...`)
      await prisma.chatbotPrompt.create({
        data: {
          category: 'geminiQuizPrompts',
          language: lang.code,
          title: `${lang.name} B1 Quiz`,
          prompt: `Create an interactive vocabulary and grammar quiz for B1 level learners in ${lang.name}. Include 10 questions with multiple-choice options, contextual sentences, and concise explanations in ${lang.name}.`,
          rank: 2.5
        }
      })
    }
  }
  console.log('Gemini Quiz Prompts check complete.')
}

async function main() {
  await seedLinks()
  await seedMissingGeminiPrompts()
}

main()
  .catch(err => {
    console.error('Error seeding:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
