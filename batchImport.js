const fs = require('fs');

const assert = require("assert");

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = require("./data/greetings.json")

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = await client.db("exercise_1");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount);

    console.log('you good')
  } catch (err) {
    console.error(err.stack)
  }
}





batchImport()

module.exports = {batchImport}