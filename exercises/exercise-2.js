const { MongoClient } = require('mongodb');
require('dotenv').config();


const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const assert = require('assert');
const { start } = require('repl');


const createGreeting = async (req, res) => {
    // temporary content... for testing purposes.
    console.log(req.body);

    const client = await MongoClient(MONGO_URI, options);
    

    try{
        await client.connect();

        const db = client.db('exercise_1');

        const result = await db.collection("greetings").insertOne(req.body);

        assert.strictEqual(1, result.insertedCount);
        res.status(201).json({ status: 201, data: req.body});


    }catch(error){
        console.log(error.stack)
        res.status(500).json({ status: 500, data: req.body, message: error.message });
    }
    
    client.close();
    console.log("Disconnected!!")

};

const getGreeting = async(req, res) =>{

    const _id = req.params._id.toUpperCase();

    console.log(_id)

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db('exercise_1');

    db.collection("greetings").findOne({_id} , (err, result) => {
        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: "Not Found" });
        client.close();
    });
}


const getGreetings = async(req, res) =>{
    
    const client = await MongoClient(MONGO_URI, options)

    try{

        await client.connect();
    
        const db = client.db('exercise_1');
 
    
        const {start, limit} = req.query 
    

        let isNotNumber = isNaN(parseInt(start)) || isNaN(parseInt(limit));

        console.log('valid', isNotNumber)

        
    
        const data = await db.collection("greetings").find().toArray()
        let dataSlice = data.slice(parseInt(start), parseInt(start) + parseInt(limit))

        console.log(dataSlice.length)

        if(!isNotNumber){
            if(data.length > 0){

                if(parseInt(start) + parseInt(limit) <= data.length){
                    res.status(200).json({
                        status: 200, 
                        data: dataSlice})
                }else{
                    res.status(200).json({
                        status: 200, 
                        start: parseInt(start),
                        limit: data.length - parseInt(start),
                        data: dataSlice})
                }
    
            } else{
                throw('emplty data')
            }
        }else{
            throw('start and limit must be numbers')
        }

    } catch(error){

        console.log(error.stack)
        res.status(500).json({ status: 500, data: error});

    }

    client.close()
    console.log('Disconnected!!')
    





}

const deleteGreeting = async(req, res) =>{


    console.log(req.body);

    const client = await MongoClient(MONGO_URI, options);

    const _id = req.params._id.toUpperCase();
    
    console.log(_id)

    try{
        await client.connect();

        const db = client.db('exercise_1');
        let query = { "_id": _id }


        console.log('resu', query)

        const result = await db.collection("greetings").deleteOne(query)

        console.log('res', result.deletedCount)


        res.status(204).json({ status: 204, data: query });


    }catch(error){
        console.log(error.stack)
        res.status(500).json({ status: 500, data: error.message });
    }
    
    client.close();
    console.log("Disconnected!!")

}



module.exports = {createGreeting, 
    getGreeting, 
    getGreetings,
    deleteGreeting}
