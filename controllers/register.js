const handleRegister = (db, bcrypt) => (req, res) => {
  ;async (req, res) => {
    const { email, password, name } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({ response: 'Incorrect form submission' })
    }

    if (!email.includes('@') || !email.includes('.'))
      return res.status(400).json({ response: 'Incorrect form submission' })

    const hash = bcrypt.hashSync(password)
    try {
      db.transaction(async (trx) => {
        try {
          const id = generateID()
          const [loginEmail] = await trx('login')
            .insert({ id, email, hash })
            .returning('email')
          const [user] = await trx('users').returning('*').insert({
            id,
            user_name: name,
            email: loginEmail.email,
            joined: new Date(),
          })
          res.json({ response: 'success', user })
        } catch (error) {
          trx.rollback(error)
        }
      })
    } catch (error) {
      res.status(400).json({ response: 'Unable to register user' })
    }
  }
}

export default handleRegister