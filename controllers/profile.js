const handleProfile = (req, res, db) => {
  const { id } = req.body
  db.select('*')
    .from('users')
    .where('id', '=', id)
    .then((user) => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'))
}
