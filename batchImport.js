const { MongoClient } = require("mongodb");
const fs = require("file-system");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const client = new MongoClient(MONGO_URI, options);

const batchImport = async () => {
  try {
    const dbName = "exercise_1";

    await client.connect();

    const db = client.db(dbName);
    console.log("connected");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, result.insertedCount);

    console.log(result, "success");
  } catch (err) {
    console.log(err);
  }
};

batchImport();
