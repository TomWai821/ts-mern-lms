import express from 'express';
import cors from 'cors';
import { routerHandler } from './routes';


const ORIGIN_URI = process.env.ORIGIN_URI || "";
const avaliable_ORIGIN_URI = ORIGIN_URI ? ORIGIN_URI.split(",").map(url => url.trim()) : [];

const app = express();

app.use((req, res, next) => 
{
    const origin = req.headers.origin || "*";
    
    // 強制設定所有 CORS 相關 Header
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authToken, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') 
    {
        console.log(`[CORS] Handling OPTIONS request for ${req.path} -> Returning 204`);
        return res.sendStatus(204);
    }
    
    res.on('finish', () => 
    {
        console.log(`[API] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
    });
    next();
});

app.use(cors(
{
    origin: true,
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
