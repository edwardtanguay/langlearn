import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN
})

async function main() {
  const res = await client.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='VersionItem'")
  console.log('VersionItem DDL:', res.rows[0]?.sql)
}

main().catch(console.error)
