import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt-nodejs'
import knex from 'knex'
import { v4 as uuidv4 } from 'uuid'

import handleSignin from './controllers/signin.js'
import handleRegister from './controllers/register.js'
import handleImage from './controllers/image.js'
import handleProfile from './controllers/profile.js'

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true,
    },
  },
})

const app = express()
app.use(bodyParser.json())
app.use(cors())

const { log } = console

const generateID = () => uuidv4().split('-')[0]

app.get('/', (req, res) => {
  res.json('success')
})

app.post('/signin', handleSignin(db, bcrypt))

app.post('/register', handleRegister(db, bcrypt, generateID))

app.get('/profile/:id', handleProfile(db))

app.put('/image', handleImage(db))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}`)
})
