import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env.test" });

process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'test';
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'test';
process.env.DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
process.env.BUCKET_NAME = 'test-bucket';
process.env.MONGO_URI = 'mongodb://mongo:27017/test'; 
process.env.JWT_SECRET = 'testsecret';