const handleProfile = (db) => async (req, res) => {
  const { id } = req.params
  try {
    const [user] = await db('users').where({ id })

    if (user) {
      res.json({ response: 'success', user })
    } else {
      res.status(404).json({ response: 'user not found' })
    }
  } catch (error) {
    res.status(404).json({ response: 'error getting user' })
  }
}

export default handleProfile
