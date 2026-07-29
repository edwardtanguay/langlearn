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

      // Clean sidecar files (.sqlite-wal, .sqlite-shm, .sqlite-info)
      const sidecars = [filePath + '-wal', filePath + '-shm', filePath + '-info']
      for (const sidecar of sidecars) {
        if (fs.existsSync(sidecar)) {
          try {
            fs.unlinkSync(sidecar)
          } catch (e) {
            // Ignore if file is locked
          }
        }
      }

      // Clean orphaned .tmp, -wal, -shm files across backup directory
      try {
        const files = fs.readdirSync(backupDir)
        for (const file of files) {
          if (file.startsWith('.tmp') || file.endsWith('-wal') || file.endsWith('-shm') || file.endsWith('-info')) {
            try {
              fs.unlinkSync(path.join(backupDir, file))
            } catch (e) {
              // Ignore locked files
            }
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
