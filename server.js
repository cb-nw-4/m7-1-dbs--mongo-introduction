"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1-3");
const { addUser } = require("./exercises/exercise-1-4");
const {
  createGreeting,
  getGreeting,
  getMultipleGreetings,
  deleteGreeting,
  updateGreeting,
} = require("./exercises/exercise-2");
// const { addUser } = require("./exercises/exercise-1.4");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1
  .get("/exercise-1/users", (req, res) => {
    getUsers(req, res, "exercise_1");
  })

  .post("/exercise-1/users", (req, res) => {
    addUser(req, res, "exercise_1");
  })
  // exercise 2
  .post("/exercise-2/greeting", (req, res) => {
    createGreeting(req, res, "exercise_1");
  })

  .get("/exercise-2/:_id", (req, res) => {
    getGreeting(req, res, "exercise_1");
  })

  .get("/ex-2/greeting", (req, res) => {
    getMultipleGreetings(req, res, "exercise_1");
  })

  .delete("/ex-2/greeting/:_id", (req, res) => {
    deleteGreeting(req, res, "exercise_1");
  })

  .put("/ex-2/greeting/:_id", (req, res) => {
    updateGreeting(req, res, "exercise_1");
  })

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
