import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag
} from '../services/posts.js'

export const querySchema = `
  input PostsOptions {
    sortBy: String,
    sortOrder: String
  }
  type Query {
    test: String,
    posts(options: PostsOptions): [Post!]!,
    postsByAuthor(username: String!, options: PostsOptions): [Post!]!,
    postByTag(tag: String!, options: PostsOptions): [Post!]!,
    post(id: ID!, options: PostsOptions): Post
  }
`

export const queryResolver = {
  Query: {
    test: () => {
      return "Hello World from GraphQL!"
    },
    posts: async () => {
      return await listAllPosts()
    },
    postsByAuthor: async (parent, { username, options }) => {
      return await listPostsByAuthor(username, options)
    },
    postByTag: async (parent, { tag, options }) => {
      return await listPostsByTag(tag, options)
    },
    post: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}