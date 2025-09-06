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

  const trx = await db.transaction()
  try {
    const hash = bcrypt.hashSync(password)

    // Insert into login
    const login = await trx('login')
      .returning('email')
      .insert({ id: uuidv4(), email, hash })
      .then((rows) => rows[0])

    // Insert into users
    const user = await trx('users')
      .returning('*')
      .insert({
        id: uuidv4(),
        user_name: name,
        email: login.email,
        joined: new Date(),
      })
      .then((rows) => rows[0])

    await trx.commit()

    return res.json({ response: 'success', user })
  } catch (error) {
    await trx.rollback()
    console.error('Register error:', error)
    return res.status(500).json({ response: 'Unable to register user' })
  }
}

export default handleRegister
