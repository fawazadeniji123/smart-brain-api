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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0])
  } else {
    res.status(401).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
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
    res.status(400).json('not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body
  const found = database.users.find((user) => user.id === id)
  if (found) {
    found.entries++
    res.json(found.entries)
  } else {
    res.status(400).json('not found')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}!`)
})
