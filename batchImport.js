const fs = require("file-system");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("exercises");
    console.log("connected!");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount);

    // res.status(201).json({ status: 201, data: greetings });
  } catch (err) {
    console.log(err.stack);
    //     res
    //       .status(500)
    //       .json({ status: 500, data: greetings, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

batchImport();
