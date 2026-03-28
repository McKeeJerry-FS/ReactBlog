import mongoose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = process.env.MONGO_URI

  mongoose.connection.on('open', () => {
    console.log('Database connection established to', DATABASE_URL)
  })

  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
