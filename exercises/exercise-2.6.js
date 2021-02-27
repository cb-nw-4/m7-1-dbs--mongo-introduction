const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;

  try {
    if (!hello) {
      throw new Error("hello is undefined");
    }
    const newValues = { $set: { hello } };
    console.log(req.body);

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = await client.db("exercise_1");

    const result = await db
      .collection("greetings")
      .updateOne({ _id }, newValues);
    assert.strictEqual(1, result.matchedCount, "document doesn't exist");
    assert.strictEqual(1, result.modifiedCount, "db error, maybe this has already been updated?");
    res.status(201).json({
      status: 204,
      message: result,
    });
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({
      status: 400,
      message: err.message,
      _id
    });
  }
};

module.exports = { updateGreeting };
