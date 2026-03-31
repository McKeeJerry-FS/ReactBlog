import { createUser, loginUser, getUserInfoById } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({
        username: user.username,
      })
    } catch (error) {
      return res
        .status(400)
        .json({
          error: 'Failed to create user, does the username already exist?',
        })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const { token } = await loginUser(req.body)
      return res.status(200).json({ token })
    } catch (error) {
      if (error.message === 'JWT secret is not configured') {
        return res
          .status(500)
          .json({ error: 'Server auth configuration is missing.' })
      }
      return res
        .status(400)
        .json({
          error:
            'Login Failed, did you enter the correct username and password?',
        })
    }
  })

  app.get('/api/v1/user/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).json(userInfo)
  })
}
