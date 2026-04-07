import { listPostsByAuthor } from "../services/posts.js"

export const userSchema = `
  type User {
    username: String!,
    posts: [Post!]!
  }
`

export const userResolver = {
  User: {
    posts: async (user) => {
      return await listPostsByAuthor(user.username)
    },
  },
}