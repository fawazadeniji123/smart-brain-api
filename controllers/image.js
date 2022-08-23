const handleImage = (db) => async (req, res) => {
  const { id } = req.body
  try {
    const [user] = await db('users')
      .where({ id })
      .increment('entries', 1)
      .returning('*')

    if (user) {
      res.json({ response: 'success', user })
    } else {
      res.status(404).json({ response: 'user not found' })
    }
  } catch (error) {
    res.status(404).json({ response: 'error updating entries' })
  }
}

export default handleImage
