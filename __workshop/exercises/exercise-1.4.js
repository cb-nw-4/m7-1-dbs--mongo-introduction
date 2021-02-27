const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  let client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const data = await db.collection("users").insertOne({ name: "Boba Cat" });
  console.log(data);
  client.close();

  if (data) {
    res.status(201).json({
      status: 201,
      data: data.ops,
    });
  } else {
    res.status(404).json({
      status: 404,
      error: `Can't add user`,
    });
  }
};

module.exports = {
  addUser,
};
