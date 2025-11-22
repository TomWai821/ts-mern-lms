import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ debug: false });
const MONGO_URI = process.env.MONGO_URI as string;

export const connectToMongoDB = async () => 
{
    try
    {
        mongoose.connect(MONGO_URI);
        console.log('Connect to mongoDB successfully!');
    }
    catch(error)
    {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}