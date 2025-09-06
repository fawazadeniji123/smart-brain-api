const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ response: 'Incorrect form submission' })
  }

  try {
    const { hash } = await db('login')
      .select('hash')
      .where({ email })
      .then((rows) => rows[0])

    if (!bcrypt.compareSync(password, hash)) {
      console.log('incorrect password')
      res.status(400).json({ response: 'Invalid email or password' })
    }

    const user = await db('users')
      .returning('*')
      .where({ email })
      .then((rows) => rows[0])

    res.json({ response: 'success', user })
  } catch (error) {
    res.status(400).json({ response: 'Invalid email or password' })
  }
}

export default handleSignin
