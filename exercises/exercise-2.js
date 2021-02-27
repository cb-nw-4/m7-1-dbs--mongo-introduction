const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const greeting = req.body;

    const result = await db.collection("greetings").insertOne(greeting);
    assert.strictEqual(1, result.insertedCount);

    res.status(201).json({
      status: 201,
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: error.message,
    });
  }
  client.close();
  console.log("disconnected");
};

const getGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  await client.connect();
  const db = client.db("exercise_1");
  db.collection("greetings")
    .findOne({ _id: _id })
    .then((result) => {
      res.status(200).json({
        status: 200,
        _id,
        data: result,
      });
    })
    .catch((error) => {
      console.log("error", error);
      res.status(404).json({
        status: 404,
        _id,
        data: "Not Found",
        error,
      });
    })
    .finally(() => {
      client.close();
      console.log("disconnected");
    });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const greetings = await db.collection("greetings").find().toArray();
  const shortGreetings = greetings.slice(1, 26);
  if (shortGreetings === []) {
    res.status(404).json({
      status: 404,
      shortGreetings,
      message: "Data not found",
      error,
    });
  } else {
    res.status(200).json({
      status: 200,
      data: shortGreetings,
    });
  }
  client.close();
  console.log("disconnected");
};

module.exports = { createGreeting, getGreeting, getGreetings };
