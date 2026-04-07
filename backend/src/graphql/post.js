import { getUserInfoById } from "../services/users.js"

export const postSchema = `
  type Post {
    id: ID!,
    title: String!,
    author: User
    contents: String!,
    tags: [String!],
    createdAt: Float,
    updatedAt: Float
  }
`

export const postResolver = {
    Post: {
        author: async (post) => {
            return await getUserInfoById(post.author)
        },
    },
}