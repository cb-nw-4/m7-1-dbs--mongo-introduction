const { MongoClient, Db } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

const createGreeting = async (req, res) => {
  try {
    const dbName = "exercise_1";

    const lang = req.body.lang;
    const _id = req.body._id;
    const hello = req.body.hello;

    await client.connect();

    const db = client.db(dbName);
    console.log("connected");

    const greetings = await db.collection("greetings").find().toArray();

    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("disconnected!");
};

const getGreeting = async (req, res) => {
  const dbName = "exercise_1";
  const _id = req.params._id;

  await client.connect();

  const db = client.db(dbName);
  console.log("connected");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found " });
    client.close();
  });
};

module.exports = { createGreeting, getGreeting };
