import express from 'express';
import { UserRegisterRules, UserLoginRules, UserModifyDataRules, UserModifySelfDataRules } from '../../validator/expressBodyValidator'
import { DeleteUser, GetUserData, ChangeUserData, UserLogin, UserRegister, ModifySuspendListData, UpdateUserProfileData, GetSelfUserData, SuspendUser, UnsuspendUser } from '../../controller/userController';
import { FetchUserFromHeader } from '../../middleware/User/authMiddleware';
import { SuspendListValidation, CompareUserStatus, FoundUserFromParams, UserLoginDataValidation, UserRegisterDataValidation } from '../../middleware/User/userValidationMiddleware';
import { BuildUserUpdateDataService } from '../../service/user/userUpdateDataService';
import { LoginAndFindUser, ValidateAuthTokenAsAdmin, ValidationForModifyStatus } from '../../data/middlewareGroup';

const router = express.Router();

// For librarian
router.get('/UserData/tableName=:tableName', FetchUserFromHeader, GetUserData);
router.get('/UserData', UserModifySelfDataRules, FetchUserFromHeader, GetSelfUserData);

// For guest
router.post('/Register', UserRegisterRules, UserRegisterDataValidation, UserRegister);
router.post('/Login', UserLoginRules, UserLoginDataValidation, UserLogin);

// For modify user data as admin (librarian)
router.put('/UserData/id=:id', UserModifyDataRules, ...ValidateAuthTokenAsAdmin, FoundUserFromParams, BuildUserUpdateDataService, ChangeUserData);
// For user modify self data (username/password)
router.put('/UserData/type=:type', ...LoginAndFindUser, UpdateUserProfileData);

// For status only
router.put('/Suspend/id=:id', UserModifyDataRules, ...ValidateAuthTokenAsAdmin, ...ValidationForModifyStatus, FoundUserFromParams, CompareUserStatus, SuspendUser);
router.put('/UnSuspend/id=:id', UserModifyDataRules, ...ValidateAuthTokenAsAdmin, ...ValidationForModifyStatus, FoundUserFromParams, CompareUserStatus, UnsuspendUser);
router.put('/SuspendListData/id=:id', UserModifyDataRules, ...ValidateAuthTokenAsAdmin, FoundUserFromParams, SuspendListValidation, ModifySuspendListData);

router.delete('/User/id=:id', ...ValidateAuthTokenAsAdmin, FoundUserFromParams, DeleteUser);

export default router;