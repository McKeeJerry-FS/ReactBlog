import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { optionalAuth } from './middleware/jwt.js'
import { typeDefs, resolvers } from './graphql/index.js'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())

postsRoutes(app)
userRoutes(app)
eventRoutes(app)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

app.get('/', (req, res) => {
  res.send('Hello World from Express!')
})

apolloServer
  .start()
  .then(() => app.use(
    '/graphql', 
    optionalAuth, 
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth}
      },
    }),
  ),
)

export { app }
