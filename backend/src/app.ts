import express from 'express';
import cors from 'cors';
import { routerHandler } from './routes';


const ORIGIN_URI = process.env.ORIGIN_URI || "";
const avaliable_ORIGIN_URI = ORIGIN_URI ? ORIGIN_URI.split(",").map(url => url.trim()) : [];

const app = express();

app.use((req, res, next) => 
{
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    next();
});

app.use(cors(
    {
        origin: avaliable_ORIGIN_URI,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["content-type", "authToken"],
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routerHandler(app);

export default app
