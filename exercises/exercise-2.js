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

    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount);
    //console.log(greetings);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  } finally {
    client.close();
  }
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;
  // console.log(_id);
  const client = await MongoClient(MONGO_URI, options);
  try {
    // res.status(200).json("bacon");
    await client.connect();

    const db = client.db("exercise_1");

    db.collection("greetings").findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
      client.close();
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
};

const getGreetings = async (req, res) => {
  const start = parseInt(req.query.start) - 1;
  //console.log(start);
  const limit = parseInt(req.query.limit);
  //console.log(limit);
  const finish = start + limit;
  //console.log(finish);

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("exercise_1");
    const greetings = await db.collection("greetings").find().toArray();
    //console.log(greetings);

    if (finish && start < greetings.length) {
      res.status(200).json({
        status: 200,
        start: start + 1,
        limit: greetings.slice(start, finish).length,
        data: greetings.slice(start, finish),
      });
    } else if (!finish || start >= 0 || !limit) {
      res.status(500).json({
        status: 500,
        message:
          start > greetings.length
            ? "Start number is larger than array length"
            : "Please input valid numbers for both start and limit",
        data: greetings,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("exercise_1");

    const result = await db.collection("greetings").deleteOne({ _id });
    assert.strictEqual(1, result.deletedCount);
    //console.log(greetings);
    res.status(204).json({ status: 204, message: "Deleted" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: _id, message: err.message });
  } finally {
    client.close();
  }
};

const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.params._id;
  try {
    await client.connect();

    const db = client.db();

    const query = { _id };
    const newValues = { $set: { hello: req.body.hello } };
    //const newValues = { $unset: { "hello   ": "" } };

    const keyIsNotHello = () => {
      throw new Error("Key is not hello");
    };

    const result = await db
      .collection("greetings")
      .updateOne(query, req.body.hello ? newValues : keyIsNotHello());
    assert.strictEqual(1, result.matchedCount, "Result match not found");
    assert.strictEqual(1, result.modifiedCount, "Result match not modified");

    // if(result.matchedCount != 1){
    //   throw new Error("Document not matched ")
    // } else if (result.modifiedCount != 1) {
    //   throw new Error("Matched document not modified")
    // }

    res.status(204).json({ status: 204, message: "Updated" });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
