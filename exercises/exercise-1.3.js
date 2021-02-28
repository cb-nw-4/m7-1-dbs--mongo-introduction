"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// HERE WE ARE GETTING DATA FROM THE DB COLLECTION "USERS" AND SENDING IT FROM THE FRONT END TO THE SERVER BY EXPORTING IT.
// ON THE FRONTEND - IF THERE IS DATA IN THE ARRAY RESPOND WITH 200 AND DATA. IF NO DATA RESPOND WITH 404.
// ON THE BACKEND - WE SEND TO THE BACKEND TO BE DEALT WITH BY AN ENDPOINT LIKE BEFORE.
// WE IMPORT ON THE BACKEND BY USING (FOR THIS EXAMPLE) const { getUsers } = require("./exercises/exercise-1.3");

// IN THIS CASE WE MADE A GET REQUEST ON THE BACKEND (FOR THIS EXAMPLE).get("/exercise-1/users", getUsers)
// INSOMMNIA ACTS AS THE BROWSER WHEN WE DONT HAVE ONE. SO CAN TRY IT OUT BY ADDING THE URL OF THE ENDPOINT IN INSOMMNIA.
// GET http://localhost:8000/exercise-1/users/
// THIS RETURNS THE DATA REQUESTED IN THE GET REQUEST.

const getUsers = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  // connect to the client
  await client.connect();
  const db = client.db("exercise_1");

  const data = await db.collection("users").find().toArray();
  console.log(data);

  data.length
    ? res.status(200).json({ status: 200, data })
    : res.status(404).json({ status: 404, message: "Error, no data" });

  // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

module.exports = { getUsers };
