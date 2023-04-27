import db from '../database/connection.js'
import { Router } from 'express'

const router = Router()

router.get('/protected/users/id', async (req, res) => {
  const id = req.session.sessionId
  let user
  if (id) {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  }

  const data = { message: 'Could not find user' }
  let status = 404
  if (user) {
    data.user = { username: user.username }
    status = 200
  }

  res.status(status).send(data)
})

export default router
