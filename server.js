import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt-nodejs'
import knex from 'knex'
import { v4 as uuidv4 } from 'uuid'

import handleSignin from './controllers/signin'
import handleRegister from './controllers/register'
import handleImage from './controllers/image'
import handleProfile from './controllers/profile'

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '6123',
    database: 'smart-brain',
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

app.post('/register', handleRegister(db, bcrypt))

app.get('/profile/:id', handleProfile(db))

app.put('/image', handleImage(db))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}`)
})
