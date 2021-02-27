const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  let client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const data = await db.collection("users").find().toArray();
  console.log(data);
  client.close();

  if (data) {
    res.status(200).json({
      status: 200,
      data: data,
      message: "Request successful",
    });
  } else {
    res.status(404).json({
      status: 404,
      error: `No match found`,
    });
  }
};

module.exports = {
  getUsers,
};
