const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ response: 'Incorrect form submission' })
  }

  try {
    const [{ _, hash }] = await db('login')
      .select('email', 'hash')
      .where({ email })
    if (bcrypt.compareSync(password, hash)) {
      try {
        const [user] = await db('users').returning('*').where({ email })
        res.json({ response: 'success', user })
      } catch (error) {
        res.status(400).json({ response: 'Unable to get user' })
      }
    } else {
      res.status(400).json({ response: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(400).json({ response: 'Invalid email or password' })
  }
}

export default handleSignin