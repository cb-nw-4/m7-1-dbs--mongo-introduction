const assert = require("assert");
const { MongoClient } = require("mongodb");
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

    const db = client.db("exercise_2");
    console.log("connected!");

    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);    

    console.log(req.body);
    res.status(201).json({ status: 201, data: req.body });
    
} catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
}

  client.close();
  console.log("disconnected!");
}

module.exports = { createGreeting };
