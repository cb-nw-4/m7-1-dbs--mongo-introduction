const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  // TODO: connect...
  // TODO: declare 'db'
  // We are using the 'exercises' database
  // and creating a new collection 'greetings'
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

module.exports = {
  createGreeting,
};
