import fs from 'fs'
import path from 'path'

const backupDir = path.join(process.cwd(), 'dev', 'backups', 'database')
if (fs.existsSync(backupDir)) {
  const files = fs.readdirSync(backupDir)
  let removed = 0
  for (const file of files) {
    if (file.endsWith('-wal') || file.endsWith('-shm') || file.endsWith('-info') || file.startsWith('.tmp')) {
      try {
        fs.unlinkSync(path.join(backupDir, file))
        removed++
      } catch (e) {
        console.warn('Could not remove file:', file)
      }
    }
  }
  console.log(`Cleaned ${removed} sidecar files from dev/backups/database`)
}
