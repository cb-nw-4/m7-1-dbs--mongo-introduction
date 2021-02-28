const fs = require("file-system");

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const { MongoClient } = require("mongodb");

const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  //console.log(greetings);
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("exercise_1");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount);
    console.log("JSON file added");
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.close();
  }
};

batchImport();
