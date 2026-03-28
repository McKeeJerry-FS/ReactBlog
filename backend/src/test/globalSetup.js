import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  })

  global.__MONGOD__ = instance
  process.env.MONGO_URI = instance.getUri()
}
