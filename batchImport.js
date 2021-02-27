const { MongoClient } = require("mongodb");
var file = require("file-system");
var fs = require("fs");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/exercise_1?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (dbName) => {
  try {
    //console.log(greetings);
    //Create new client
    const client = await MongoClient(MONGO_URI, options);
    //Connect Client
    await client.connect();
    //Connect to the db
    const db = client.db(dbName);
    await db.collection("greetings").insertMany(greetings);
    assert.strictEqual(greetings.length, result.insertedCount);
    console.log("Status 201");
  } catch (err) {
    console.log("Status 500");
  }
};

batchImport("exercise_1");
