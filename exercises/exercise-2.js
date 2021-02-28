const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// HERE WE ARE ADDING DATA FROM REQ.BODY TO THE DATABASE (USING insertOne()).
// USE INOMMNIA TO SUBMIT.
// WE EXPORT createGreeting TO THE BACKEND WHERE WE HAVE A POST REQUEST .post("/exercise-2/greeting", createGreeting) TO
// SEND THE DATA.
// WE SEND FROM INSOMMNIA BY PUTTING IT IN THE BODY AND SENDING IT THROUGH POST http://localhost:8000/exercise-2/greeting
// WE GET A SUCCESS MESSAGE AND THE DATA IS IN THE DB.

const createGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("exercises");

    const result = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

// HERE WE ARE GETTING (ONE ITEM OF) DATA FROM THE DB.
// WE ARE USING THE findOne() METHOD.
// WE PUT THE URL IN THE BROWSER (OR HERE INSOMMNIA) OF THE ENDPOINT WE MADE IN THE BACKEND.
// THIS WAS .get("/exercise-2/greeting/:_id", getGreeting) SO WE PUT THE ID OF THE ACCOUNT WE WANT TO GET FROM THE DB.

const getGreeting = async (req, res) => {
  const { _id } = req.params;
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();
  const db = client.db("exercises");

  db.collection("greetings").findOne(
    { _id: _id.toUpperCase() },
    (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
      client.close();
    }
  );
};

const getGreetings = async (req, res) => {
  const { start, limit } = req.query;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");

  // HERE WE ARE GETTING ALL ITEMS OF DATA FROM THE DB.
  // WE ARE USING THE .find() and then .toArray() METHODS.
  // WE PUT THE URL IN THE BROWSER (OR HERE INSOMMNIA) OF THE ENDPOINT WE MADE IN THE BACKEND.
  // THIS WAS const { getGreetings } = require("./exercises/exercise-2").
  // THIS EXAMPLE WILL BE COMMENTED OUT AS THE QUESTION ASKS FOR THE DATA TO BE FIL;TERED ETC.

  //   db.collection("greetings")
  //     .find()
  //     .toArray((err, result) => {
  //       if (result.length) {
  //         res.status(200).json({ status: 200, result });
  //       } else {
  //         res.status(404).json({ status: 404, result: "Not Found" });
  //       }
  //       client.close();
  //     });
  // };

  db.collection("greetings")
    .find()
    .toArray((err, result) => {
      // if (result.length) {
      //  RETURN FIRST 25 RESULTS
      // const first25 = result.slice(0, 24);

      // HERE WE ARE LIMITING RESULTS WITH QUERY STRINGS.
      // Start AND Limit HAVE BEEN DECLARED AS QUERY STRINGS.
      // BELOW WE DO DIFFERENT SEARCHES DEPENDING ON THE QUERY STRING (req.query).
      // RESULTS ARE CHANGED ACCORDING TO THE VALUES OF start AND limit.

      if (!start && !limit) {
        res.status(200).json({
          status: 200,
          start: 0,
          limit: "none",
          message: "no start no limit",
          data: result,
        });
      } else if (!start && limit) {
        res.status(200).json({
          status: 200,
          start: "none",
          limit: limit,
          message: "no start",
          data: result.slice(0, limit),
        });
      } else if (start && !limit) {
        res.status(200).json({
          status: 200,
          start: start,
          limit: "none",
          message: "no limit",
          data: result.slice(start, result.length),
        });
      } else if (start && limit) {
        res.status(200).json({
          status: 200,
          start: start,
          limit:
            result.length < Number(start) + Number(limit)
              ? Number(result.length) - Number(start)
              : Number(start) + Number(limit),

          message: "start and limit",
          data: result.slice(start, Number(start) + Number(limit)),
        });
      } else {
        res.status(404).json({ status: 404, result: "Not Found" });
      }
      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const { lang } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercises");
    await db.collection("greetings").deleteOne({ lang: lang });

    res.status(204).json({
      status: 204,
      message: "success",
      data: { lang: lang },
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      status: 500,
      data: `Not Found`,
      message: err.message,
    });
  }
};

const updateGreeting = async (req, res) => {
  // req.params
  const { _id } = req.params;
  // req.body
  const { hello } = req.body;

  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: 'Only "hello" is to be updated.',
    });
    return;
  }

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercises");

  try {
    const query = { _id };
    const newValues = { $set: { hello } };
    const result = await db.collection("greetings").updateOne(query, newValues);
    assert.equal(1, result.matchedCount);
    assert.equal(1, result.modifiedCount);
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
