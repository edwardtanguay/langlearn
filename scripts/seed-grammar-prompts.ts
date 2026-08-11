import 'dotenv/config'
import { PrismaClient } from '../server/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const newPrompts = [
  // Spanish
  {
    language: 'es',
    title: 'ser vs. estar',
    prompt: 'Create an interactive quiz on the subject of distinguishing between ser and estar in various contexts and sentence structures. Make the content of the quiz, including the instructions, entirely in Spanish.',
    rank: 1
  },
  {
    language: 'es',
    title: 'subjuntivo vs. indicativo',
    prompt: 'Create an interactive quiz on the subject of choosing between the subjunctive (presente de subjuntivo) and indicative moods in subclauses. Make the content of the quiz, including the instructions, entirely in Spanish.',
    rank: 2
  },
  {
    language: 'es',
    title: 'por vs. para',
    prompt: 'Create an interactive quiz on the subject of correct usage of prepositions por and para with practice exercises. Make the content of the quiz, including the instructions, entirely in Spanish.',
    rank: 3
  },

  // German
  {
    language: 'de',
    title: 'Wechselpräpositionen',
    prompt: 'Create an interactive quiz on the subject of two-way prepositions (Wechselpräpositionen) and deciding between Dativ and Akkusativ depending on motion vs. location. Make the content of the quiz, including the instructions, entirely in German.',
    rank: 2
  },
  {
    language: 'de',
    title: 'Konjunktiv II',
    prompt: 'Create an interactive quiz on the subject of Konjunktiv II for hypothetical situations, wishes, and polite requests. Make the content of the quiz, including the instructions, entirely in German.',
    rank: 3
  },
  {
    language: 'de',
    title: 'Adjektivdeklination',
    prompt: 'Create an interactive quiz on the subject of adjective endings after definite, indefinite, and zero articles across all four cases. Make the content of the quiz, including the instructions, entirely in German.',
    rank: 4
  },

  // Dutch
  {
    language: 'nl',
    title: 'er & prepositional adverbs',
    prompt: 'Create an interactive quiz on the subject of using the word "er" with prepositions and in existential sentences (er is/er zijn). Make the content of the quiz, including the instructions, entirely in Dutch.',
    rank: 2
  },
  {
    language: 'nl',
    title: 'de vs. het and adjectival -e',
    prompt: 'Create an interactive quiz on the subject of article selection (de vs. het) and the rules for adding -e to adjectives. Make the content of the quiz, including the instructions, entirely in Dutch.',
    rank: 3
  },
  {
    language: 'nl',
    title: 'word order & inversion',
    prompt: 'Create an interactive quiz on the subject of Dutch main clause and subclause word order, inversion, and verb placement at the end of subclauses. Make the content of the quiz, including the instructions, entirely in Dutch.',
    rank: 4
  }
]

async function seedGrammarPrompts() {
  console.log('Seeding difficult grammar topics for Spanish, German, and Dutch...')

  for (const item of newPrompts) {
    const created = await prisma.chatbotPrompt.create({
      data: {
        category: 'geminiQuizPrompts',
        language: item.language,
        title: item.title,
        prompt: item.prompt,
        rank: item.rank
      }
    })
    console.log(`Created [${created.language}] ${created.title} (ID: ${created.id})`)
  }

  console.log('Database seeding completed successfully!')
}

seedGrammarPrompts()
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
