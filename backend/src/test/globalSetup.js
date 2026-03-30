import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  if (process.platform === 'linux' && !process.env.MONGOMS_DISTRO) {
    process.env.MONGOMS_DISTRO = 'ubuntu-22.04'
  }

  const instance = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14',
    },
  })

  global.__MONGOD__ = instance
  process.env.MONGO_URI = instance.getUri()
}
