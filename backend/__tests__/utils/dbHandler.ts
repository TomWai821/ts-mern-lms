import mongoose from "mongoose";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDB } from "../../src/init/connectToDynamoDB";

export const connectTestDB = async () => 
{
    if (!process.env.MONGO_URI) 
    {
        throw new Error("MONGO_URI is not defined");
    }
    
    if (mongoose.connection.readyState === 0) 
    {
        await mongoose.connect(process.env.MONGO_URI, 
        {
            serverSelectionTimeoutMS: 20000,
        });
    }
};

export const closeTestDB = async () => 
{
    await mongoose.connection.close();
};

export const waitForTestDynamoDB = async () =>
{
    let lastError: unknown;

    for (let attempt = 0; attempt < 30; attempt++)
    {
        try
        {
            await dynamoDB.send(new ListTablesCommand({}));
            return;
        }
        catch (error)
        {
            lastError = error;
            if (attempt < 29)
            {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    throw lastError;
};