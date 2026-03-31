import mongoose from 'mongoose'
import { beforeEach, describe, expect, test } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

// Note: these tests rely on the database connection being established in setupFileAfterEnv.js
describe('Post Service', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      content: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(primaryUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost.title).toEqual(post.title)
    expect(foundPost.content).toEqual(post.content)
    expect(foundPost.tags).toEqual(post.tags)
    expect(foundPost.author.toString()).toEqual(primaryUser._id.toString())
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('without required title should fail', async () => {
    const post = {
      content: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['empty'],
    }
    try {
      await createPost(primaryUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
    }
    const createdPost = await createPost(primaryUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

// Additional tests for listing and getting posts
describe('listing posts', () => {
  test('list all posts should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })
  test('should return posts by creation date in descending order by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = [...createdSamplePosts].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })
  test('should take into account sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'createdAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = [...createdSamplePosts].sort(
      (a, b) => a.createdAt - b.createdAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })
  test('should return posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toEqual(3)
  })
  test('should return posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toEqual(1)
  })
})

// Additional tests for getting a post by ID
describe('getting a post', () => {
  test('should return a full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if post does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toBeNull()
  })
})

// Additional tests for updating a post
describe('updating a post', () => {
  test('should update the specified property', async () => {
    await updatePost(primaryUser._id, createdSamplePosts[0]._id, {
      title: 'Updated title',
    })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Updated title')
  })
  test('should not updateother properties', async () => {
    await updatePost(primaryUser._id, createdSamplePosts[0]._id, {
      title: 'Updated title',
    })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.tags).toEqual(['redux'])
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(primaryUser._id, createdSamplePosts[0]._id, {
      title: 'Updated title',
    })
    const updatedPost = await getPostById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if post does not exist', async () => {
    const updatedPost = await updatePost(
      primaryUser._id,
      '000000000000000000000000',
      {
        title: 'Updated title',
      },
    )
    expect(updatedPost).toBeNull()
  })
})

// Additional tests for deleting a post
describe('deleting a post', () => {
  test('should delete the specified post', async () => {
    const result = await deletePost(primaryUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await getPostById(createdSamplePosts[0]._id)
    expect(deletedPost).toBeNull()
  })
  test('should fail if post does not exist', async () => {
    const deletedPost = await deletePost(
      primaryUser._id,
      '000000000000000000000000',
    )
    expect(deletedPost.deletedCount).toEqual(0)
  })
})

let createdSamplePosts = []
let primaryUser
let secondaryUser
beforeEach(async () => {
  await User.deleteMany({})
  await Post.deleteMany({})
  primaryUser = await User.create({
    username: 'Daniel Bugl',
    password: 'test_password',
  })
  secondaryUser = await User.create({
    username: 'Jane Doe',
    password: 'test_password',
  })
  createdSamplePosts = []
  for (const post of samplePosts) {
    const authorId =
      post.authorUsername === 'Jane Doe' ? secondaryUser._id : primaryUser._id
    const createdPost = await createPost(authorId, {
      title: post.title,
      content: post.content,
      tags: post.tags,
    })
    createdSamplePosts.push(createdPost)
  }
})

const samplePosts = [
  {
    title: 'Learning Redux',
    authorUsername: 'Daniel Bugl',
    tags: ['redux'],
  },
  {
    title: 'Learn React Hooks',
    authorUsername: 'Daniel Bugl',
    tags: ['react'],
  },
  {
    title: 'Full Stack React Project',
    authorUsername: 'Daniel Bugl',
    tags: ['react', 'fullstack', 'nodejs'],
  },
  {
    title: 'MongoDB and Mongoose',
    authorUsername: 'Jane Doe',
  },
]
