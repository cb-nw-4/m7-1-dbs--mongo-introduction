const fs = require('file-system');
const assert = require('assert');
const { MongoClient } = require ('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const greetings = JSON.parse(fs.readFileSync('data/greetings.json'));

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
  
    const db = client.db('exercise_1');
    const col = db.collection('greetings');

    const result = await col.insertMany(greetings);

    client.close();

    assert.notStrictEqual(0, result.insertedCount);
    console.log('Inserted ' + result.insertedCount + ' records.');

  } catch (err) {
    console.log('Error inserting records: ' + err);
  }
};

batchImport();
