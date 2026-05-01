import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

export async function createPost(userId, { title, content, tags, imageUrl }) {
  const post = new Post({
    title,
    author: userId,
    content,
    tags,
    imageUrl: normalizeImageUrl(imageUrl),
  })
  return await post.save()
}

export async function listAllPosts(options) {
  return await listPost({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPost({ author: user._id }, options)
}

export async function listPostsByTag(tag, options) {
  return await listPost({ tags: tag }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(
  userId,
  postId,
  { title, content, tags, imageUrl },
) {
  const normalizedImageUrl = normalizeImageUrl(imageUrl)
  const setValues = { title, content, tags }

  if (imageUrl !== undefined) {
    setValues.imageUrl = normalizedImageUrl
  }

  return await Post.findByIdAndUpdate(
    { _id: postId, author: userId },
    { $set: setValues },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId })
}

async function listPost(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

function normalizeImageUrl(imageUrl) {
  if (imageUrl === undefined || imageUrl === null || imageUrl === '') {
    return undefined
  }

  const trimmedImageUrl = String(imageUrl).trim()
  if (!trimmedImageUrl) {
    return undefined
  }

  let parsedUrl
  try {
    parsedUrl = new URL(trimmedImageUrl)
  } catch {
    throw new Error('Image URL must be a valid URL')
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Image URL must use http or https')
  }

  return trimmedImageUrl
}
