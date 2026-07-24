import { defineNitroPlugin } from 'nitropack/runtime'
import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'
import { prisma } from '../utils/prisma'

export default defineNitroPlugin((nitroApp) => {
  // Execute startup backup asynchronously so server boot is never blocked
  setTimeout(async () => {
    try {
      const url = process.env.DATABASE_URL
      const authToken = process.env.DATABASE_AUTH_TOKEN

      if (!url || url.startsWith('file:')) {
        return
      }

      // 1. Get total flashcards count
      const flashcardCount = await prisma.flashcard.count()

      // 2. Format timestamp & filename
      const now = new Date()
      const pad = (n: number) => n.toString().padStart(2, '0')
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
      
      const backupDir = path.join(process.cwd(), 'dev', 'backups', 'database')
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }

      const filename = `langlearn-data-${timestamp}-${flashcardCount}cards.sqlite`
      const filePath = path.join(backupDir, filename)

      console.log(`[Auto-Backup] Starting startup database backup (${flashcardCount} flashcards) to ${filename}...`)

      // 3. Sync database via LibSQL client
      const backupClient = createClient({
        url: `file:${filePath}`,
        syncUrl: url,
        authToken: authToken
      })

      await backupClient.sync()
      backupClient.close()

      // Clean info file
      const infoFile = filePath + '-info'
      if (fs.existsSync(infoFile)) {
        fs.unlinkSync(infoFile)
      }

      // Checkpoint WAL
      const localDb = createClient({ url: `file:${filePath}` })
      try {
        await localDb.execute('PRAGMA wal_checkpoint(TRUNCATE)')
      } catch (e) {
        // Ignore checkpoint warning if unneeded
      }
      localDb.close()

      // Clean orphaned .tmp files
      try {
        const files = fs.readdirSync(backupDir)
        for (const file of files) {
          if (file.startsWith('.tmp')) {
            fs.unlinkSync(path.join(backupDir, file))
          }
        }
      } catch (e) {
        // Ignore temp cleanup errors
      }

      console.log(`[Auto-Backup] ✅ Startup backup successfully saved: ${filename}`)
    } catch (err) {
      console.error('[Auto-Backup] ❌ Startup database backup failed:', err)
    }
  }, 1000)
})
