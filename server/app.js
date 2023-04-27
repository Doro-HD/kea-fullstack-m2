import * as dotenv from 'dotenv'
import db from './database/connection.js'

dotenv.config()

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import session from 'express-session'
import { rateLimit } from 'express-rate-limit'
import authRouter from './routers/authRouter.js'

const app = express()

app.use(express.json())
//security
app.use(helmet())
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 60 * 60 * 1000 
  }
}))
const rateLimitGeneralOptions = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}

app.use(rateLimit(rateLimitGeneralOptions))
app.use('/signIn', rateLimit({ ...rateLimitGeneralOptions, max: 10}))

app.use('/protected', async (req, res, next) => {
  const sessionId = req.session.sessionId
  console.log(sessionId)

  let user
  if (sessionId) {
    user = await db.get(`
      SELECT * FROM USERS INNER JOIN sessions
        ON fk_username = username 
        WHERE sessions.id = ?
    `, [sessionId])
  }

  //if user exists the function exits inside the following block
  if (user) {
    next()

    return
  }

  res.status(400).send({ message: 'Unauthorized access'})
})

//routers
app.use(authRouter)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('Server running on port', PORT))