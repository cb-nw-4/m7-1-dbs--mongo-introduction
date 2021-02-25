"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const { createGreeting } = require('./exercises/exercise-2.1');
const { getGreeting } = require('./exercises/exercise-2.3');
const { allGreetings } = require('./exercises/exercise-2.4');
const { deleteGreetings } = require('./exercises/exercise-2.5');
const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

//exercise 1
 .get("/exercise-1/users", getUsers)
 .post('/exercise-1/users', addUser)
  // exercise 2
  .post('/exercise-2/greeting', createGreeting)
  .get('/exercise-2/greeting/:_id', getGreeting)

  .get('/exercise-2/greeting', allGreetings)

  .delete('/ex-2/greeting/:_id', deleteGreetings)
  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
