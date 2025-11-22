// packages
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

// another file functions
import { connectToMongoDB } from './connectToMongo';
import { detectRecordsDaily } from './detectRecord';

// routes
import userRoutes from './routes/user';
import bookRoutes from './routes/books';

dotenv.config({ debug: false });

const PORT = process.env.PORT || 5000;
const ORIGIN_URI = process.env.ORIGIN_URI as string;

connectToMongoDB();
const app = express();

app.use(cors
(
    {
        origin: ORIGIN_URI,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["content-type", "authToken"]
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);

app.listen(PORT, () => 
{ 
    console.log(`Server listen to http://localhost:${PORT}`);
})

detectRecordsDaily();