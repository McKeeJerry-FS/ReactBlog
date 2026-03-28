import { Post } from './db/models/post.js'
import { initDatabase } from './db/init.js'

await initDatabase()

const post = new Post({
  title: 'Hello Mongoose!',
  author: 'Daniel Bugl',
  contents: 'This post is stored in a MongoDB database using Mongoose.',
  tags: ['mongoose', 'mongodb'],
})

await post.save()
console.log('Post saved to database:', post)

const posts = await Post.find()
console.log('All posts in database:', posts)
