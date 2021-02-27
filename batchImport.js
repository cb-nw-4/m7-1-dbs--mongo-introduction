var fs = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  console.log(greetings);
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, result.insertedCount);

    console.log("SUCCESS", result);
  } catch (err) {
    console.log("ERROR", err.message);
  }
  client.close();
};

batchImport();
