import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import globalSetup from './test/globalSetup.js'
import { app } from './app.js'
import { initDatabase } from './db/init.js'

async function runTestingServer() {
  await globalSetup()
  await initDatabase()
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Testing server is running on port ${PORT}`)
  })
}

runTestingServer()
