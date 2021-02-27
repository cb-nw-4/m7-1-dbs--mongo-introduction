"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const { createGreeting} = require("./exercises/exercise-2.1")
const {getGreeting} = require("./exercises/exercise-2.3")
const {getGreetings} = require("./exercises/exercise-2.4")
const {deleteGreeting} = require("./exercises/exercise-2.5")
const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1

  .get("/exercise-1/users", async (req, res) => {
    const users = await getUsers("exercise_1");

    if (users.length < 1) {
      res.status(404).send({
        status: 404,
        data: "nothing here hombre",
      });
    } else {
      res.status(200).send({
        status: 200,
        data: users,
      });
    }
  })

  .post("/exercise-1/users", async (req, res) => {
    try {
      const response = await addUser("exercise_1");
      res.status(200).send({
        status: 200,
        data: response,
      });
    } catch (e) {
      res.status(400).send({
        status: 404,
        message: e,
      });
    }
  })

  // exercise 2

  .post("/exercise-2/greeting", createGreeting)

  .get("/exercise-2/:_id", getGreeting)

  .get('/ex-2/greeting', getGreetings)

  .delete('/ex-2/greeting/:_id', deleteGreeting)

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
