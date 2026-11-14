import { FetchAuthTokenFromCookie } from '../../middleware/User/authMiddleware';
import { GetSelfRecord, QRCodeHandler } from '../../controller/authController';
import express from 'express';

const router = express.Router();

router.get('/', FetchAuthTokenFromCookie, GetSelfRecord);
router.get('/qrCode', FetchAuthTokenFromCookie, QRCodeHandler);

export default router;