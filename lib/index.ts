import { MongoClient } from "mongodb";

let client: MongoClient;

const url = process.env.MONGO_URL

async function connectDatabase() {
    if (!client) {
        client = new MongoClient(url!)
        try {
            await client.connect()
            console.log('Mongodb Connected');
        } catch (error) {
            console.error('Error in connecting mongodb',error)
        }
    }
    return client
}

export {connectDatabase}