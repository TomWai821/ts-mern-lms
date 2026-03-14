import express from 'express';
import cors from 'cors';
import { routerHandler } from './routerList';

const ORIGIN_URI = process.env.ORIGIN_URI as string;
const avaliable_ORIGIN_URI = ORIGIN_URI.split(",");

const app = express();

app.use(cors({
  origin: avaliable_ORIGIN_URI,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["content-type", "authToken"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routerHandler(app);

export default app;
