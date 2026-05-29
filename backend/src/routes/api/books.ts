import express from 'express';
import { upload } from '../../storage/multerConfig';
import { LoginAndFindUser, ValidateAuthTokenAsAdmin } from '../../data/middlewareGroup';
import { CreateBookRecord, DeleteBookRecord, EditBookRecord, GetBookRecord, GetDataFromGoogleBook, GetImageController } from '../../controller/bookController';

import { BookCreateRules } from '../../validator/expressBodyValidator';

import { CreateLoanBookRecord, GetLoanBookRecord, UpdateLoanBookRecord } from '../../controller/loanBookController';
import { BookGenreIDAndLanguageIDValidation, BookNameValidation, BookRecordIDValidation, FoundBookLoanRecord } from '../../middleware/Book/bookValidationMiddleware';
import { FetchUserFromHeader } from '../../middleware/User/authMiddleware';
import { CreateFavouriteBookRecord, DeleteFavouriteBookRecord, GetFavouriteBookRecord } from '../../controller/favouriteBookController';
import { HandleEditImage } from '../../service/image/bookEditImageService';
import { GetBookDataMiddleware } from '../../middleware/Book/BookMiddleware';
import { GetFavouriteBookDataMiddleware } from '../../middleware/Book/FavouriteBookMiddleware';


const router = express.Router();

// For book records
router.get('/record', GetBookDataMiddleware, GetBookRecord);
router.post('/record', upload.single("image"), BookCreateRules, ...ValidateAuthTokenAsAdmin, BookNameValidation, BookGenreIDAndLanguageIDValidation, CreateBookRecord);
router.put('/record/id=:id', upload.single("image"), ...ValidateAuthTokenAsAdmin, BookRecordIDValidation, BookGenreIDAndLanguageIDValidation, HandleEditImage, EditBookRecord);
router.delete('/record/id=:id', ...ValidateAuthTokenAsAdmin, BookRecordIDValidation, DeleteBookRecord);

// For Loan book records
router.get('/loanRecord/type=:type', FetchUserFromHeader, GetLoanBookRecord);
router.post('/loanRecord', ...ValidateAuthTokenAsAdmin, CreateLoanBookRecord);
router.put('/loanRecord/id=:id', ...ValidateAuthTokenAsAdmin, FoundBookLoanRecord, UpdateLoanBookRecord);

// For Favourite book records
router.get('/favourite', ...LoginAndFindUser, GetFavouriteBookDataMiddleware, GetFavouriteBookRecord);
router.post('/favourite', ...LoginAndFindUser, CreateFavouriteBookRecord);
router.delete('/favourite/id=:id', ...LoginAndFindUser, DeleteFavouriteBookRecord);

// For image
router.get("/uploads/:imageName", GetImageController);
router.get("/external", ...LoginAndFindUser, GetDataFromGoogleBook)

export default router;