"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// HERE WE ARE POSTING REQ.BODY DATA (POST REQUEST) FROM THE FRONT END TO THE DB COLLECTION "USERS",
// AND SENDING IT FROM THE FRONT END TO THE SERVER BY EXPORTING IT AT THE SAME TIME.
// ON THE FRONTEND - IF THERE IS DATA IN THE ARRAY RESPOND WITH 201 THAT IT IS POSTED SUCCESSFULLY
// ON THE BACKEND - WE SEND TO THE BACKEND TO BE DEALT WITH BY AN ENDPOINT LIKE BEFORE.
// WE IMPORT ON THE BACKEND BY USING (FOR THIS EXAMPLE) const { addUser } = require("./exercises/exercise-1.4");;

// IN THIS CASE WE MADE A POST REQUEST ON THE BACKEND (FOR THIS EXAMPLE).post("/exercise-1/users", addUser)
// INSOMMNIA ACTS AS THE BROWSER WHEN WE DONT HAVE ONE. SO CAN TRY IT OUT BY ADDING THE URL OF THE ENDPOINT IN INSOMMNIA.
// POST http://localhost:8000/exercise-1/users/
// THIS RETURNS THE DATA REQUESTED IN THE GET REQUEST.

const addUser = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();
  const db = client.db("exercise_1");
  const { name } = req.body;
  await db.collection("users").insertOne({ name: "Lilly Podzinski" });

  res.status(201).json({ status: 201, data: req.body });

  // close the connection to the database server
  client.close();
};

module.exports = { addUser };
