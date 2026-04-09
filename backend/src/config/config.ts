import dotenv from 'dotenv';
dotenv.config();

type StorageType = 'S3' | 'LOCAL';

export const config = 
{
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    STORAGE_TYPE: (process.env.STORAGE_TYPE || 'S3').toUpperCase() as StorageType,
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || 'http://localhost:5000',
    PORT: process.env.PORT || 5000,
};