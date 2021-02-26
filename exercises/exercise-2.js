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

const getGreeting = async (req, res) => {
  const _id = req.params._id;

  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
  
    const db = client.db('exercise_1');
    
    await db.collection('greetings').findOne({ _id }, (err,result) => {
      if (result) {
        res.status(200).json({ status: 200, _id, data: result });
      } else {
        res.status(404).json({ status: 404, _id, data: 'Not found' });
      }

      client.close();
    });
  } catch (err) {
    res.status(500).json({ status: 500, data: _id, message: err.message });
  }
};

module.exports = { createGreeting, getGreeting };
