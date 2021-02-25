"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { getUsers } = require("./exercises/exercise-1.3");
const { addUser } = require("./exercises/exercise-1.4");
const { createGreeting } = require("./exercises/exercise-2");

const PORT = process.env.PORT || 8000;

express()
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // exercise 1.3
  .get('/exercise-1/users', async (req, res) => {
    try {
      const response = await getUsers();
      
      if (response.length === 0) {
        res.status(404).json({ status: 404 });
      } else {
        res.status(200).json({ status: 200, data: response });
      }
    } catch (err) {
      res.status(500).json({ status: 500, data: err });
    }
  })

  // exercise 1.4
  .post('/exercise-1/users', async (req, res) => {
    try {
      const response = await addUser(req);

      if (response.result.ok === 1) {
        res.status(201).json({ status: 201, data: response.ops[0] });
      } else {
        res.status(400).json({ status: 400, data: req.body});
      }
    } catch (err) {
      res.status(500).json({ status: 500, data: err});
    }
  })

  // exercise 2.1
  .post('/exercise-2/greeting', createGreeting)

  // handle 404s
  .use((req, res) => res.status(404).type("txt").send("🤷‍♂️"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
