import 'dotenv/config'
import { createClient } from '@libsql/client'

async function main() {
  const url = process.env.DATABASE_URL
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (!url) {
    console.error('DATABASE_URL missing')
    return
  }

  const client = createClient({ url, authToken })

  try {
    const res = await client.execute("SELECT id, front, back, frontLanguage, backLanguage FROM Flashcard WHERE front LIKE '%<%' OR back LIKE '%<%'")
    console.log(`FOUND ${res.rows.length} CARDS WITH '<':`)
    for (const r of res.rows) {
      console.log('---')
      console.log('ID:', r.id)
      console.log('Front:', r.front)
      console.log('Back:', r.back)
      console.log('URL:', `http://localhost:3149/flashcard/${r.id}`)
    }
  } catch (err) {
    console.error('Query error:', err)
  } finally {
    client.close()
  }
}

main()
