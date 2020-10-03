"use strict";

const fs = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");

const client = new MongoClient("mongodb://localhost:27017", {
  useUnifiedTopology: true,
});

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  try {
    await client.connect();

    const db = client.db("exercises");

    const result = await db.collection("two").insertMany(greetings);
    assert.equal(greetings.length, result.insertedCount);
    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

batchImport();
