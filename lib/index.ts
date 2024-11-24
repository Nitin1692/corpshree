import { MongoClient } from "mongodb";

let client: MongoClient;

const url = 'mongodb+srv://nj5930595:YCORpV7AMRZF3soD@fomofactory.kas6lb3.mongodb.net/';

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