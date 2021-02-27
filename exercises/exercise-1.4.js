const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const newUser = req.body;

  await db
    .collection("users")
    .insertOne(newUser)
    .then((result) =>
      res.status(201).json({
        status: 201,
        data: result,
      })
    )
    .catch((error) =>
      res.status(400).json({
        status: 400,
        message: `User not added to database due to ${error}`,
      })
    );

  client.close();
  console.log("disconnected");
};

module.exports = { addUser };
