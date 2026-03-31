import dotenv from 'dotenv'
dotenv.config()
import { app } from './app.js'
import { initDatabase } from './db/init.js'


const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
  console.info(`Server is running on port ${PORT}`)
  try {
    await initDatabase()
  } catch (error) {
    console.error('Database connection failed:', error)
  }
})
