const { MongoClient } = require("mongodb");
const fs = require("file-system");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(134, result.insertedCount);
    console.log(result);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
    console.log("disconnected");
  }
};

batchImport();
