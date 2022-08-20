import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const { log } = console

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
}

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json('incorrect form submission')
  }

  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json(database.users[0])
  } else {
    res.status(401).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  })
  res.json(database.users.at(-1))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  const found = database.users.find((user) => user.id === id)
  if (found) {
    res.json(found)
  } else {
    res.status(404).json('user not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body
  const found = database.users.find((user) => user.id === id)
  if (found) {
    found.entries++
    res.json(found.entries)
  } else {
    res.status(404).json('user not found')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}!`)
})
