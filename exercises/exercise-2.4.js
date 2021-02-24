const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const allGreetings = async (req, res) => {
  const start = req.query.start;
  const limit = req.query.limit;
  console.log(start);
  console.log(limit);
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const results = await db.collection("greetings").find().toArray();
    const total = results.length;
    console.log(total);
    if (results && start && limit) {
      if (start > total || limit > total) {
        res
          .status(200)
          .json({
            status: 200,
            message: `There is only ${total} items in this collection`,
            data: results.slice(total - 10, total),
            
          });
      } else {
        res
          .status(200)
          .json({ status: 200, data: results.slice(start, limit) });
      }
    } else if (!start || !limit) {
      res.status(200).json({ status: 200, data: results.slice(0, 24) });
    } else {
      res.status(404).json({ status: 404, _id, data: "Not Found" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};
module.exports = { allGreetings };
