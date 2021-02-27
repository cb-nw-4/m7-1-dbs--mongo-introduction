const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");
const greetings = require("../data/greetings.json");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//ex 2.1
const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    // TODO: connect...
    await client.connect();

    // TODO: declare 'db'
    const db = client.db("exercises");
    console.log("connected!");

    // We are using the 'exercises' database
    // and creating a new collection 'greetings'
    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  console.log(req.body);
  client.close();
  console.log("disconnected!");
};

// ex 2.3
const getGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");
  console.log("connected!");

  await db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res
          .status(404)
          .json({ status: 404, _id, data: "Not Found", error: err });

    client.close();
    console.log("disconnected!");
  });
};

// ex2.4
const getGreetings = async (req, res) => {
  let start = parseInt(req.query.start);
  let limit = parseInt(req.query.limit);
  console.log(start, limit);
  const client = await MongoClient(MONGO_URI, options);
  let slicedResult = [];
  await client.connect();
  const db = client.db("exercises");
  console.log("connected!");

  const result = await db.collection("greetings").find().toArray();

  // slicedResult = result.slice(start, start + limit);
  if (start !== limit) {
    if (start === null || limit === null || start < 0 || limit < 0) {
      start = 0;
      limit = 0;
      slicedResult = result.slice(start, start + limit);
    } else if (
      start > result.length ||
      limit > result.length ||
      start + limit > result.length
    ) {
      start = result.length - 10;
      slicedResult = result.slice(start);
    } else {
      slicedResult = result.slice(start, start + limit);
    }
  } else {
    slicedResult = result.slice(start, start + limit);
  }
  console.log(slicedResult);
  client.close();
  console.log("disconnected!");
  res
    .status(200)
    .json({ status: 200, start: start, limit: limit, data: slicedResult });
};

// ex2.5
const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  try {
    await client.connect();

    const db = client.db("exercises");
    console.log("connected!");

    const result = await db.collection("greetings").deleteOne({ _id });
    assert.strictEqual(1, result.deletedCount);

    res.status(204).json({
      status: 204,
      data: _id,
      message: `Object with id ${_id} deleted`,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: _id, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting };
