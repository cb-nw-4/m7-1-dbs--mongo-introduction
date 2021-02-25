"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const { createGreeting, getGreeting, getGreetings, deleteGreeting, updateGreeting } = require("./exercises/exercise-2");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1

  // exercise 2

  //exercise 1-3
  .get("/exercise-1/users", getUsers)

  //exercise 1-4
  .post("/exercise-1/users", addUser)

  //exercise 2.1
  .post('/exercise-2/greeting', createGreeting)

  //exercise 2.3
  .get('/exercise-2/greeting/:_id', getGreeting)
  //exercise 2.4
  .get('/ex-2/greeting', getGreetings)
  //exercise 2.5
  .delete('/ex-2/greeting/:_id', deleteGreeting)
  //exercise 2.6
  .put('/ex-2/greeting/:_id', updateGreeting)
  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
