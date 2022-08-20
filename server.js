import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt-nodejs'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const { log } = console

const generateID = () => uuidv4().split('-')[0]

const database = {
  users: [
    {
      id: generateID(),
      name: 'John',
      email: 'john@gmail.com',
      password: 'john',
      entries: 0,
      joined: new Date(),
    },
    {
      id: generateID(),
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'sally',
      entries: 0,
      joined: new Date(),
    },
    {
      id: generateID(),
      name: 'Mike',
      email: 'mike@gmail.com',
      password: 'mike',
      entries: 0,
      joined: new Date(),
    },
    {
      id: generateID(),
      name: 'Fawaz',
      email: 'fawaz@gmail.com',
      password: 'fawaz',
      entries: 0,
      joined: new Date(),
    },
    {
      id: generateID(),
      name: 'Aisha',
      email: 'aisha@gmail.com',
      password: 'aisha',
      entries: 0,
      joined: new Date(),
    },
    {
      id: generateID(),
      name: 'Rahinat',
      email: 'rahinat@gmail.com',
      password: 'rahinat',
      entries: 0,
      joined: new Date(),
    },
  ],
}

app.get('/', (req, res) => {
  res.json('success')
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ response: 'Incorrect form submission' })
  }
  const user = database.users.find((user) => user.email === email)
  if (user) {
    res.json({ response: 'success', user })
  } else {
    res.status(401).json({ response: 'Invalid email or password' })
  }
})

app.post('/register', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }

  database.users.push({
    id: generateID(),
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  })
  res.json({ response: 'success', user: database.users.at(-1) })
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  const user = database.users.find((user) => user.id === id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json('user not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body
  const user = database.users.find((user) => user.id === id)
  if (user) {
    user.entries++
    res.json(user.entries)
  } else {
    res.status(404).json('user not found')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}!`)
})
