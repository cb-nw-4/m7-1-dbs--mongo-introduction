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
  console.log(greetings);

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();

    const db = client.db();

    const result = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, result.insertedCount);
    res.status(201).json({ status: 201, data: greetings });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }

  // TODO: close...
  client.close();
};

batchImport();
