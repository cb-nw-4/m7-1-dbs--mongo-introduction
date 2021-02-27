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
    let db = client.db("exercise_1");
    //let newCollection = await db.createCollection("greetings");

    const result = await db.collection("greetings").insertOne(req.body);
    console.log(result);
    assert.equal(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    let db = client.db("exercise_1");

    db.collection("greetings").findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
      client.close();
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, data: req.param._id, message: err.message });
  }
  client.close();
};

const getGreetings = async (req, res) => {
  const start = parseInt(req.query.start) - 1;
  const limit = parseInt(req.query.limit) + start;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");

    const result = await db.collection("greetings").find().toArray();
    console.log(result);

    if (result.length > 0 && start < result.length) {
      if (limit <= result.length) {
        const slicedResults = result.slice(start, limit);
        res.status(200).json({ status: 200, data: slicedResults });
      } else {
        const slicedResults = result.slice(result.length - 10, result.length);
        res
          .status(200)
          .json({
            status: 200,
            start: start,
            limit: result.length,
            data: slicedResults,
          });
      }
    } else {
      res.status(404).json({ status: 404, data: "Bad request" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
};
