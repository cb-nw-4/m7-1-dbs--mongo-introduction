const fs = require('fs')
const assert = require('assert')

const { MongoClient } = require('mongodb')
require('dotenv').config()
const { MONGO_URI } = process.env

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const greetings = JSON.parse(fs.readFileSync('data/greetings.json'))

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('exercise_1')
    console.log('connected!')
    const result = await db.collection('greetings').insertMany(greetings)
    assert.equal(greetings.length, result.insertedCount)

    console.log({ status: 201, data: greetings })
    // res.status(201).json({
    //   status: 201,
    //   data: greetings,
    // })
  } catch (err) {
    console.log({ status: 500, data: greetings, message: err.message })
    // res.status(500).json({
    //   status: 500,
    //   data: greetings,
    //   message: err.message,
    // })
  }
  client.close()
  console.log('disconnected!')
}
batchImport()
