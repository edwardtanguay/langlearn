import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
dotenv.config()

const url = "file:./dev.db"

const client = createClient({
  url,
})

async function check() {
  try {
    const users = await client.execute("SELECT * FROM User;")
    console.log("Local Users count:", users.rows.length)
    console.log(users.rows)

    const flashcards = await client.execute("SELECT * FROM Flashcard;")
    console.log("Local Flashcards count:", flashcards.rows.length)
  } catch (err) {
    console.error("Error connecting to local DB:", err)
  } finally {
    client.close()
  }
}

check()
