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

    const db = client.db("exercises");
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


const getGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);  
  
  await client.connect();

  const db = client.db("exercises");
  console.log("connected!");

  const _id = req.params._id;
  console.log(_id);

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  })
}


const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercises");
  console.log("connected!");

  const collection = db.collection("greetings")
  
  const results = await collection.find().toArray();

  const startNumber = parseInt(req.query.start);
  const limitNumber = parseInt(req.query.limit);

  if (startNumber < 135 && ((startNumber + limitNumber) < 135)) {
    res.status(200).json({ status: 200, data: results.slice(startNumber, startNumber + limitNumber)});
  } else {
    res.status(404).json({ status: 404, data: "Please change your query."}); 
  }

  client.close();
}


const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const { _id } = req.params;
  
  try {
    await client.connect();

    const db = client.db("exercises");
    console.log("connected!");

    const result = await db.collection("greetings").deleteOne({ "_id" : _id });
    assert.equal(1, result.deletedCount);

    if (result.deletedCount === 1) {
      res.status(204).json({ status: 204, data: _id, message: "That greeting has been deleted." });
    } else {
      res.status(500).json({ status: 500, data: _id, message: err.message });  
    }

  } catch (err) {
    console.log(err);
    console.log("There's been an error");
  }
  
  client.close();
}


const updateGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { _id } = req.params;
//   const query = { _id };
  const { hello } = req.body;
//   const values = {...req.body};

//   console.log(query);

  console.log(_id);
  console.log(hello);


  if (!hello) {
      res.status(404).json({ status: 404, message: "Hello is not part of your message"});
      client.close();
      return;
  }

  try {
    await client.connect();

    const db = client.db("exercises");
    console.log("connected!");


    db.collection("greetings").findOne({ _id }, (err, result) => {
      if (!result) {
        res.status(404).json({ status: 404, _id, data: "Not Found" });
        client.close();
        return;
      }
    })

        const newValues = { $set: { "hello": req.body.hello }};  

        const results = await db.collection("greetings").updateOne({ _id }, newValues);
        console.log(results.matchedCount);
        console.log(newValues);
        assert.equal(1, results.matchedCount);
        assert.equal(1, results.modifiedCount);

        res.status(200).json({ status: 200, _id, ...req.body });

  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });  
  }
  client.close();
}

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting, updateGreeting };
