const { MongoClient } = require("mongodb");

require("dotenv").config();
// const { MONGO_URI } = process.env;

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/exercise_1?retryWrites=true&w=majority";
const assert = require("assert");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res, dbName) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("greetings").insertOne(req.body);
    console.log(result);
    assert.strictEqual(1, result.insertedCount);
    res.status(201).json({ ...req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getGreeting = async (req, res, dbName) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  await db
    .collection("greetings")
    .findOne({ _id: req.params._id }, (err, result) => {
      result
        ? res
            .status(200)
            .json({ status: 200, id: req.params._id, data: result })
        : res
            .status(404)
            .json({ status: 404, id: req.params._id, data: "Not Found" });
      client.close();
    });
};

const getMultipleGreetings = async (req, res, dbName) => {
  var startPos = req.query.start;
  var limit = req.query.limit;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  const data = await db.collection("greetings").find().toArray();

  if (
    startPos !== undefined &&
    limit !== undefined &&
    limit > startPos &&
    data.length > 0
  ) {
    var greetings = data.slice(startPos, limit);
  } else if (limit === undefined && startPos !== undefined && data.length > 0) {
    var greetings = data.slice(parseInt(startPos), parseInt(startPos) + 25);
    console.log("data", data);
    console.log(
      "Start Position given but no limit",
      startPos,
      parseInt(startPos) + 25,
      greetings
    );
  } else {
    var greetings = data.slice(0, 25);
  }

  if (greetings.length > 0) res.status(201).json({ status: 201, greetings });
  else res.status(404).json({ status: 404, data: "Not Found" });
  client.close();
};

const deleteGreeting = async (req, res, dbName) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    await db.collection("greetings").deleteOne({ _id: req.params._id });
    assert.strictEqual(1, result.deletedCount);
    res.status(201).json({ status: 201 });
    client.close();
  } catch (err) {
    console.log("Error: ", err);
  }
};

const updateGreeting = async (req, res, dbName) => {
  try {
    const query = req.params._id;
    const newValues = { $set: { ...req.body } };
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(dbName);
    await db.collection("greetings").updateOne({ _id: query }, newValues);
    assert.strictEqual(1, results.modifiedCount);
    assert.strictEqual(1, results.matchedCount);
    res.status(200).json({ status: 200 });
    client.close();
  } catch (err) {
    res.status(404).json({ status: 404 });
    console.log("Error: ", err);
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getMultipleGreetings,
  deleteGreeting,
  updateGreeting,
};
