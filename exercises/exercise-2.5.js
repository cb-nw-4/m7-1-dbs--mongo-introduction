const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const deleteGreeting = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const deleteId = req.params._id;
  console.log(deleteId);
  await client.connect();

  const db = await client.db("exercise_1");

  db.collection("greetings")
    .deleteOne({ _id: deleteId })
    .then((result) => {
      res.status(201).json({
        status: 204,
        message: result.deletedCount,
      });
    })
    .catch((e) => {
      res.status(400).json({
        status: 400,
        message: "did not work",
      });
    });
};

module.exports = { deleteGreeting };
