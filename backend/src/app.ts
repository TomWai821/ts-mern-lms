import express from 'express';
import cors from 'cors';
import { routerHandler } from './routes';

const ORIGIN_URI = process.env.ORIGIN_URI || "";
const avaliable_ORIGIN_URI = ORIGIN_URI ? ORIGIN_URI.split(",").map(url => url.trim()) : [];

const app = express();

app.use(cors(
{
    origin: avaliable_ORIGIN_URI,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["content-type", "authToken"],
    credentials: true,
    optionsSuccessStatus: 200
}
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routerHandler(app);

export default app
