import { v4 as uuidv4 } from 'uuid'

const handleRegister = (db, bcrypt) => async (req, res) => {
  const { email, password, name } = req.body

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ response: 'Incorrect form submission' })
  }
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ response: 'Invalid email format' })
  }

  try {
    const hash = bcrypt.hashSync(password)
    const trxProvider = await db.transactionProvider()

    // Insert into login
    let trx = await trxProvider()
    const login = await trx('login')
      .returning('email')
      .insert({ id: uuidv4(), email, hash })
      .then((rows) => rows[0])

    // Insert into users
    trx = await trxProvider()
    const user = await trx('users')
      .returning('*')
      .insert({
        id: uuidv4(),
        user_name: name,
        email: login.email,
        joined: new Date(),
      })
      .then((rows) => rows[0])

    return res.json({ response: 'success', user })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ response: 'Unable to register user' })
  }
}

export default handleRegister
