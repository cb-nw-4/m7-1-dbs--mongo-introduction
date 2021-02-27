const { MongoClient, Db } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const dbName = "exercise_1";

  await client.connect();

  const db = client.db(dbName);
  console.log("connected");

  const users = await db.collection("users").find().toArray();
  console.log(users);

  client.close();
  console.log("disconnected!");

  if (users === "") {
    return res.status(404).json({ status: 404 });
  } else {
    return res.status(200).json({ status: 200, data: users });
  }
};

module.exports = { getUsers };
