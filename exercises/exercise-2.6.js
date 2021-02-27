const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const updateGreeting = async (req, res) => {

  const _id = req.params._id;
  const query = { _id };
  const newValues = { ...req.body };
  const filteredNewValues = {
      hello: newValues["hello"]
  };

  const client = await MongoClient(MONGO_URI, options);
  try {
      await client.connect();
      const db = client.db("exercises");
      if (Object.keys(req.body).includes("hello") === true) {
          const results = await db.collection("greetings").updateOne(query, { $set: filteredNewValues });
          assert.equal(1, results.matchedCount);
          assert.equal(1, results.modifiedCount);
          res.status(200).json({ status: 200, _id, filteredNewValues });
      }
      else if (Object.keys(req.body).includes("hello") === false) {
          res.status(500).json({ status: 500, _id, message: "Incorrect key" });
          return;
      }
  } catch (err) {
      console.log(err.stack);
      res.status(500).json({ status: 500, _id, message: err.message });
  }
  client.close();
}
   

module.exports = { updateGreeting };
