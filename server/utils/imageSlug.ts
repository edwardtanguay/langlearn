import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.gif']

export type ImageCategory = 'howtos' | 'links'

function getScreenshotsDir(): string {
  return process.env.SCREENSHOTS_DIR || 'C:\\WORK\\import'
}

function getTargetDir(category: ImageCategory): string {
  return path.resolve(process.cwd(), 'public', 'images', category)
}

function findFileInDir(dir: string, baseName: string): { filePath: string; ext: string } | null {
  if (!dir || !fs.existsSync(dir)) return null
  for (const ext of SUPPORTED_EXTS) {
    const candidate = path.join(dir, `${baseName}${ext}`)
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { filePath: candidate, ext }
    }
  }
  // Fallback: case-insensitive check
  try {
    const entries = fs.readdirSync(dir)
    const lowerBase = baseName.toLowerCase()
    for (const entry of entries) {
      const parsed = path.parse(entry)
      const extLower = parsed.ext.toLowerCase()
      if (parsed.name.toLowerCase() === lowerBase && SUPPORTED_EXTS.includes(extLower)) {
        const candidate = path.join(dir, entry)
        if (fs.statSync(candidate).isFile()) {
          return { filePath: candidate, ext: extLower }
        }
      }
    }
  } catch {
    // ignore read errors
  }
  return null
}

/**
 * Checks SCREENSHOTS_DIR for <slug>.(jpg|jpeg|png|gif), copies full image and generates
 * <slug>-thumb.<ext> into public/images/<category>/.
 * Returns { imageUrl, thumbUrl } or { imageUrl: null, thumbUrl: null }.
 */
export async function syncAndResolveSlugImages(
  slug: string | null | undefined,
  category: ImageCategory
): Promise<{ imageUrl: string | null; thumbUrl: string | null }> {
  const cleanSlug = typeof slug === 'string' ? slug.trim() : ''
  if (!cleanSlug) return { imageUrl: null, thumbUrl: null }

  // Prevent path traversal
  if (cleanSlug.includes('/') || cleanSlug.includes('\\') || cleanSlug.includes('..')) {
    return { imageUrl: null, thumbUrl: null }
  }

  const targetDir = getTargetDir(category)
  const sourceDir = getScreenshotsDir()

  const sourceMatch = findFileInDir(sourceDir, cleanSlug)
  if (sourceMatch) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const destFull = path.join(targetDir, `${cleanSlug}${sourceMatch.ext}`)
    const thumbExt = sourceMatch.ext === '.gif' ? '.gif' : sourceMatch.ext
    const destThumb = path.join(targetDir, `${cleanSlug}-thumb${thumbExt}`)

    const srcStat = fs.statSync(sourceMatch.filePath)
    const needCopy = !fs.existsSync(destFull) || fs.statSync(destFull).mtimeMs < srcStat.mtimeMs

    if (needCopy) {
      fs.copyFileSync(sourceMatch.filePath, destFull)
      try {
        if (sourceMatch.ext === '.gif') {
          fs.copyFileSync(sourceMatch.filePath, destThumb)
        } else {
          await sharp(sourceMatch.filePath)
            .resize({ width: 320, withoutEnlargement: true })
            .toFile(destThumb)
        }
      } catch (err) {
        console.warn(`Thumbnail generation failed for ${cleanSlug}, copying original:`, err)
        fs.copyFileSync(sourceMatch.filePath, destThumb)
      }
    }

    return {
      imageUrl: `/images/${category}/${cleanSlug}${sourceMatch.ext}`,
      thumbUrl: fs.existsSync(destThumb)
        ? `/images/${category}/${cleanSlug}-thumb${thumbExt}`
        : `/images/${category}/${cleanSlug}${sourceMatch.ext}`
    }
  }

  // Otherwise check if already present in public/images/<category>/
  const existingFull = findFileInDir(targetDir, cleanSlug)
  if (existingFull) {
    const existingThumb = findFileInDir(targetDir, `${cleanSlug}-thumb`)
    return {
      imageUrl: `/images/${category}/${cleanSlug}${existingFull.ext}`,
      thumbUrl: existingThumb
        ? `/images/${category}/${cleanSlug}-thumb${existingThumb.ext}`
        : `/images/${category}/${cleanSlug}${existingFull.ext}`
    }
  }

  return { imageUrl: null, thumbUrl: null }
}

