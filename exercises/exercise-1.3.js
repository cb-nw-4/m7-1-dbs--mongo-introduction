const { MongoClient } = require('mongodb')

require('dotenv').config()
const { MONGO_URI } = process.env

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('exercise_1')
  const users = await db.collection('users').find().toArray()
  console.log(users)

  if (users.length === 0) {
    res.status(404).json({
      status: 404,
      message: 'data not found',
      data: users,
    })
  } else {
    res.status(202).json({
      status: 202,
      message: `success`,
    })
  }
  client.close()
  console.log('disconnected!')
}
module.exports = { getUsers }
