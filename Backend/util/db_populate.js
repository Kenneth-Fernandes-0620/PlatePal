// Code to populate the MongoDB collection with data from a JSON file

const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://root:${process.env.MONGODB_PASS}@blog.oloxt.mongodb.net/?retryWrites=true&w=majority&appName=blog`;
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        // Specify the database and collection
        const database = client.db('food_ordering_website');
        const collection = database.collection('food_items');

        // Read and parse the JSON file
        const data = JSON.parse(fs.readFileSync('../data/data.json', 'utf8'));

        // Insert the data into the collection
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error(error);
    } finally {
        // Close the connection
        await client.close();
    }
}

run().catch(console.dir);
