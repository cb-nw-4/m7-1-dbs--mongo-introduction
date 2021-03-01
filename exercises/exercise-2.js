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

    db.collection("greetings").findOne({$or:[
                    {_id: _id},
                    {lang: _id}
                ]} , (err, result) => {
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
            res.status(200).json({
                status: 200, 
                data: data})
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
    
    console.log(_id, 'id')

    try{
        await client.connect();

        const db = client.db('exercise_1');
        let query = { "_id": _id }

        const result = await db.collection("greetings").deleteOne(query)

        
        if( result.deletedCount === 1){
            console.log(typeof result.deletedCount , 'delete')
            
            res.status(200).json({ status: 200, data: 'the document was delete with success'});
        }else{
            throw("the document with giver Id can't be Deleted!! verify the Id and try again")
        }

    }catch(error){
        console.log(error)
        res.status(500).json({ status: 500, data: error});
    }
    
    client.close();
    console.log("Disconnected!!")

}

const updateGreeting = async(req, res)=>{

    console.log(req.body);

    const client = await MongoClient(MONGO_URI, options);

    const _id = req.params._id.toUpperCase();

    const query = {_id};
    const newValues = { $set: { ...req.body } };

    
    console.log(query, 'id')
    try{
        await client.connect();

        const db = client.db('exercise_1');
        
    
        console.log('new', newValues)
        if(req.body.hello){
            const result = await db.collection("greetings").updateOne(query, newValues)
            assert.strictEqual(1, result.matchedCount);
            assert.strictEqual(1, result.modifiedCount);
            
            res.status(200).json({ status: 200, _id, ...req.body });

        }else{
            throw('must modify hello word')
        }


    }catch(error){
        console.log(error)
        res.status(500).json({ status: 500, data: error});
    }
    
    client.close();
    console.log("Disconnected!!")



}



module.exports = {createGreeting, 
    getGreeting, 
    getGreetings,
    updateGreeting,
    deleteGreeting}
