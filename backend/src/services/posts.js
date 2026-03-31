import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js';

export async function createPost(userId, { title, content, tags }) {
  const post = new Post({ title, author: userId, content, tags})
  return await post.save()
}

export async function listAllPosts(options) {
  return await listPost({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPost({ author: user._id }, options);
}

export async function listPostsByTag(tag, options) {
  return await listPost({ tags: tag }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(userId, postId, { title, content, tags }) {
  return await Post.findByIdAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, content, tags } },
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
