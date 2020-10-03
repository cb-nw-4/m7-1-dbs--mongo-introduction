"use strict";

const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createGreeting = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("exercises");

    const result = await db.collection("two").insertOne(req.body);
    assert.equal(1, result.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  db.collection("two").findOne({ _id: _id.toUpperCase() }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  // create a new client
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  db.collection("two")
    .find()
    .toArray((err, result) => {
      if (result.length) {
        const start = Number(req.query.start) || 0;
        const cleanStart = start > -1 && start < result.length ? start : 0;
        const end = cleanStart + (Number(req.query.limit) || 25);
        const cleanEnd = end > result.length ? result.length - 1 : end;
        const data = result.slice(cleanStart, cleanEnd);
        res.status(200).json({ status: 200, data });
      } else {
        res.status(404).json({ status: 404, data: "Not Found" });
      }
      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  try {
    await client.connect();
    const db = client.db("exercises");

    const result = await db
      .collection("two")
      .deleteOne({ _id: _id.toUpperCase() });
    assert.equal(1, result.deletedCount);
    res.status(204).json({ status: 204, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;

  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: 'Only "hello" may be updated.',
    });
    return;
  }

  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  try {
    await client.connect();
    const db = client.db("exercises");

    const query = { _id };
    const newValues = { $set: { hello } };
    const result = await db.collection("two").updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({ status: 200, _id });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
