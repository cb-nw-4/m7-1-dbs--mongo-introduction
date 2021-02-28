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
  //console.log(newUser);

  await db.collection("users").insertOne(newUser);

  if (newUser) {
    res.status(201).json({ status: 201, data: newUser });
  }

  client.close();
};

module.exports = { addUser };
