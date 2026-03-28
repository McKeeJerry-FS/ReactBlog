import { Post } from '../db/models/post.js'

export async function createPost({ title, content, author, tags }) {
  const post = new Post({ title, content, author, tags })
  return await post.save()
}

export async function listAllPosts(options) {
  return await listPost({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPost({ author }, options)
}

export async function listPostsByTag(tag, options) {
  return await listPost({ tags: tag }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(postId, { title, content, author, tags }) {
  return await Post.findByIdAndUpdate(
    { _id: postId },
    { $set: { title, content, author, tags } },
    { new: true },
  )
}

export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}

async function listPost(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}
