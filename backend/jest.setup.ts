import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env.test" });

process.env.AWS_REGION = 'us-east-1';
process.env.BUCKET_NAME = 'test-bucket';
process.env.MONGO_URI = 'mongodb://mongo:27017/test'; 
process.env.JWT_SECRET = 'testsecret';