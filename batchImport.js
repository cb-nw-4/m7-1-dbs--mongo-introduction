var fs= require('file-system');

const { MongoClient } = require('mongodb');

require('dotenv').config();

const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}


const assert = require('assert');


const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));



const batchImport = async(req, res) =>{


    const client = await MongoClient(MONGO_URI, options)

    
    
    try{
        await client.connect();
    
        const db = client.db('exercise_1');
        const data =  await db.collection("greetings").insertMany(greetings);
        assert.strictEqual(greetings.length, data.insertedCount)

        console.log(data, data)


    }catch(error){
        console.log(error.stack)

    }

    client.close();
    console.log("Disconnected!!")



    
}

batchImport()