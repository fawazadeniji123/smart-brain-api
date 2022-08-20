import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const { log } = console

app.get('/', (req, res) => {
  log(req.headers)
  res.send('this is a test')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  log(`App running on port ${PORT}!`)
})
