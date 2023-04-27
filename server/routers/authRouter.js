import db from '../database/connection.js'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { v4 as uuid } from 'uuid'
import { Router } from 'express'

const router = Router()

router.post('/signUp', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const data = { message: 'Invalid request body' }
  let status = 400
  if (username && password) {
    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)


    const result = await db.run('INSERT INTO users (username, password, is_verified) VALUES (?, ?, false)', [username, hash])

    const testEmail = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testEmail.user,
        pass: testEmail.pass
      }
    })

    const info = await transporter.sendMail({
      from: 'david.bjakobsen@gmail.com',
      to: ['doro.hd@skiff.com'],
      subject: 'authenticate',
      text: 'Click the link to verify your account\n http://127.0.0.1:8080/verify/' + result.lastID
    })

    status = 200
    data.message = 'User successfully created'
  }

  res.status(status).send(data)
})

router.post('/signIn', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const data = {}
  let status = 200

  let isBadRequest = false
  if (!username || !password) {
    isBadRequest = true
    
    status = 400
    data.message = 'Invalid request body'
  }

  let user
  if (!isBadRequest) {
    user = await db.get('SELECT * FROM users WHERE username = ?', [username])

    status = 404
    data.message = 'Could not find user'
  }

  let isSamePassword = false
  if (user) {
    isSamePassword = await bcrypt.compare(password, user.password)

    status = 200
    data.message = 'Incorrect password'
  }

  if (isSamePassword) {
    const username = user.username

    data.message = 'Successfully signed in'
    data.user = { username }

    const sessionId = uuid()
    const today = new Date().toISOString()

    await db.run('INSERT INTO sessions VALUES (?, ?, ?)', [sessionId, today, username])
    req.session.sessionId = sessionId
  }

  res.status(status).send(data)
})

router.get('/verify/:userId', async (req, res) => {
  await db.exec('UPDATE users SET is_verified = true WHERE id = ?', [req.params.userId])

  res.send({ message: 'User was verified' })
})

export default router
