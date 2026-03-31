import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'


export function postsRoutes(app) {
  // GET Routes for posts
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res.status(400).json({
          error: 'Cannot filter by both author and tag at the same time',
        })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post === null) return res.status(400).end()
      return res.json(post)
    } catch (err) {
      console.error('Error fetching post by ID:', err)
      return res.status(500).end()
    }
  })

  // POST Routes for posts
  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      return res.status(201).json(post)
    } catch (err) {
      console.error('Error creating post:', err)
      return res.status(500).end()
    }
  })

  // PATCH Routes for posts
  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error updating post:', err)
      return res.status(500).end()
    }
  })

  // DELETE Routes for posts
  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(400)
      return res.status(204).end()
    } catch (err) {
      console.error('Error deleting post:', err)
      return res.status(500).end()
    }
  })
}
