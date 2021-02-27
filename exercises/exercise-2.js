const assert = require('assert')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const { MONGO_URI } = process.env

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('exercise_1')
    console.log('connected!')
    const result = await db.collection('greetings').insertOne(req.body)
    assert.equal(1, result.insertedCount)

    res.status(201).json({
      status: 201,
      data: req.body,
    })
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    })
  }
  client.close()
  console.log('disconnected!')
}

const getGreeting = async (req, res) => {
  const _id = req.params
  const client = await MongoClient(MONGO_URI, options)
  try {
    await client.connect()
    const db = client.db('exercise_1')

    db.collection('greetings').findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: 'Not Found' })
      client.close()
    })
  } catch (err) {
    console.log(err.stack)
    res.status(500).json({ status: 500, message: err.message })
    client.close()
  }
}

const getGreetings = async (req, res) => {
  const { start, limit } = req.params
  const client = await MongoClient(MONGO_URI, options)

  start = parseInt(start) ? parseInt(start) : 0
  limit = parseInt(limit) ? parseInt(limit) : 25

  try {
    await client.connect()
    const db = client.db('exercise_1')

    const data = await db.collection('greetings').find().toArray()
    if (data.length === 0) {
      res.status(404).json({
        status: 404,
        message: 'data not found',
      })
    } else {
      if (start >= data.length) {
        const newLimit = limit > data.length ? data.length : limit
        const newStart = data.length - newLimit
        res.status(200).json({
          start: newStart,
          limit: newLimit,
          status: 200,
          message: 'success',
          data: data.slice(newStart, newStart + newLimit),
        })
      } else if (start + limit > data.length) {
        const newLimit = data.length - start
        res.status(200).json({
          start: start,
          limit: newLimit,
          status: 200,
          message: 'success',
          data: data.slice(start, start + newLimit),
        })
      } else {
        res.status(200).json({
          start: start,
          limit: limit,
          status: 200,
          message: 'success',
          data: data.slice(start, start + limit),
        })
      }
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
  client.close()
}

module.exports = { createGreeting, getGreeting, getGreetings }
