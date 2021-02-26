const assert = require('assert')

const createGreeting = async (req, res) => {
  console.log(req.body)
  const client = await MongoClient(MONGO_URI, options)
  await client.connect()
  const db = client.db('exercise_1')
  console.log('connected!')
  await db.collection('users').insertOne(req.body)
  client.close()
  console.log('disconnected!')
  res.status(200).json('ok')
}
module.exports = { createGreeting }
