import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  throw createError({
    statusCode: 403,
    statusMessage: 'Delete all flashcards feature has been permanently disabled'
  })
})
