const { MongoClient } = require("mongodb");
const fs = require("fs");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

// HERE WE ARE ADDING DATA FROM A JSON DATA FILE TO THE DATABASE (USING insertMany()).
// COULD USE INOMMNIA TO SUBMIT BUT WOULD BE INEFFICIENT.
// SO INSTEAD WE DO THIS USING THE FS MODULE.
// SUBMITS THE DATA TO THE DATABASE JUST BY CALLING THE FUNCTION AND RUNNING THE CODE node batchImport.js.
// WE GET A SUCCESS MESSAGE AND THE DATA IS IN THE DB.

const batchImport = async () => {
  console.log(greetings);
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercises");

    const result = await db.collection("greetings").insertMany(greetings);
    assert.equal(greetings.length, result.insertedCount);

    console.log("success");
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

batchImport();
