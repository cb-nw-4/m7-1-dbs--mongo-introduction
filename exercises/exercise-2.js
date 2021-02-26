const assert = require('assert');
const { MongoClient } = require ('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
  
    const db = client.db('exercise_1');
    const result = await db.collection('greetings').insertOne(req.body);

    client.close();

    assert.strictEqual(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });

  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

module.exports = { createGreeting };
