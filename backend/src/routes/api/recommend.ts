import express from 'express';
import { FetchAuthTokenFromCookie } from '../../middleware/User/authMiddleware';
import { GetRecommendBookController } from '../../controller/bookRecommendationController';

const router = express.Router();

// For Suggest Book
router.get('/type=:type', FetchAuthTokenFromCookie, GetRecommendBookController);
router.post('/type=:type', FetchAuthTokenFromCookie, GetRecommendBookController);

export default router;