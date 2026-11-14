import express from 'express';
import { GetSuggestBookDataService } from '../../service/book/bookRecommendationService';
import { GetBookRecord } from '../../controller/bookController';
import { FetchAuthTokenFromCookie } from '../../middleware/User/authMiddleware';

const router = express.Router();

// For Suggest Book
router.get('/type=:type', FetchAuthTokenFromCookie, GetSuggestBookDataService, GetBookRecord);
router.post('/type=:type', FetchAuthTokenFromCookie, GetSuggestBookDataService, GetBookRecord);

export default router;