import fs from 'fs'
import path from 'path'
import { PrismaClient } from '../../server/prisma/client/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const EXTENSIONS = ['.jpg', '.png', '.gif']

function findScreenshotFile(dir: string, baseName: string): string | null {
  if (!dir || !fs.existsSync(dir)) return null
  for (const ext of EXTENSIONS) {
    const filename = `${baseName}${ext}`
    const fullPath = path.join(dir, filename)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return filename
    }
  }
  return null
}

function copyScreenshotToPublic(sourceDir: string, filename: string, category: 'howtos' | 'links') {
  const targetDir = path.resolve(process.cwd(), 'public', 'images', category)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }
  const src = path.join(sourceDir, filename)
  const dest = path.join(targetDir, filename)
  fs.copyFileSync(src, dest)
}

export async function syncScreenshots() {
  const screenshotsDir = process.env.SCREENSHOTS_DIR
  if (!screenshotsDir || !fs.existsSync(screenshotsDir)) {
    console.log(`Skipping screenshot sync: SCREENSHOTS_DIR (${screenshotsDir || 'unset'}) not found.`)
    return { howtosUpdated: 0, linksUpdated: 0 }
  }

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.log('Skipping screenshot sync: DATABASE_URL not set.')
    return { howtosUpdated: 0, linksUpdated: 0 }
  }

  const adapter = new PrismaLibSql({
    url: dbUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })
  const prisma = new PrismaClient({ adapter })

  let howtosUpdated = 0
  let linksUpdated = 0

  try {
    const howtos = await prisma.howtoItem.findMany()
    for (const item of howtos) {
      const cleanSlug = item.slug?.trim()
      if (!cleanSlug) continue

      const updates: { imageFileMain?: string; imageFileThumb?: string } = {}

      if (!item.imageFileMain) {
        const mainFile = findScreenshotFile(screenshotsDir, cleanSlug)
        if (mainFile) {
          copyScreenshotToPublic(screenshotsDir, mainFile, 'howtos')
          updates.imageFileMain = mainFile
        }
      }

      if (!item.imageFileThumb) {
        const thumbFile = findScreenshotFile(screenshotsDir, `${cleanSlug}-thumb`)
        if (thumbFile) {
          copyScreenshotToPublic(screenshotsDir, thumbFile, 'howtos')
          updates.imageFileThumb = thumbFile
        }
      }

      if (Object.keys(updates).length > 0) {
        await prisma.howtoItem.update({
          where: { id: item.id },
          data: updates
        })
        howtosUpdated++
      }
    }

    const links = await prisma.link.findMany()
    for (const link of links) {
      const cleanSlug = link.slug?.trim()
      if (!cleanSlug) continue

      if (!link.imageFileThumb) {
        const thumbFile = findScreenshotFile(screenshotsDir, `${cleanSlug}-thumb`)
        if (thumbFile) {
          copyScreenshotToPublic(screenshotsDir, thumbFile, 'links')
          await prisma.link.update({
            where: { id: link.id },
            data: { imageFileThumb: thumbFile }
          })
          linksUpdated++
        }
      }
    }
  } finally {
    await prisma.$disconnect()
  }

  return { howtosUpdated, linksUpdated }
}

