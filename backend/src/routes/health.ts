import express from 'express';
import { APIHealthDetect } from '../controller/HealthDetectController'

const router = express.Router();

router.get('/', APIHealthDetect);

export default router