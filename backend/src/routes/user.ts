import express from 'express';
import { UserRegisterRules, UserLoginRules, UserModifyDataRules, UserModifySelfDataRules } from '../model/expressBodyRules'
import { DeleteUser, GetUserData, ChangeUserData, UserLogin, UserRegister, ChangeStatus, ModifySuspendListData, UpdateUserData, GetSelfUserData } from '../controller/userController';
import { FetchUserFromHeader } from '../controller/middleware/User/authMiddleware';
import { SuspendListValidation, CompareUserStatus, FoundUserFromParams, UserLoginDataValidation, UserRegisterDataValidation } from '../controller/middleware/User/userValidationMiddleware';
import { BuildUserQueryAndGetData } from '../controller/middleware/User/userGetDataMiddleware';
import { BuildUpdateData } from '../controller/middleware/User/userUpdateDataMiddleware';
import { LoginAndFindUser, ValidationForModifyStatus } from '../Arrays/routesMap';

const router = express.Router();

router.get('/UserData/tableName=:tableName', FetchUserFromHeader, BuildUserQueryAndGetData, GetUserData);
router.get('/UserData', UserModifySelfDataRules, FetchUserFromHeader, GetSelfUserData);

router.post('/Register', UserRegisterRules, UserRegisterDataValidation, UserRegister);
router.post('/Login', UserLoginRules, UserLoginDataValidation, UserLogin);

// For another data
router.put('/UserData/id=:id', UserModifyDataRules, ...LoginAndFindUser, FoundUserFromParams, BuildUpdateData, ChangeUserData);
router.put('/UserData/type=:type', ...LoginAndFindUser, UpdateUserData);

// For status only
router.put('/Status/id=:id', UserModifyDataRules, ...LoginAndFindUser, ...ValidationForModifyStatus, FoundUserFromParams, CompareUserStatus, ChangeStatus);
router.put('/SuspendListData/id=:id', UserModifyDataRules, ...LoginAndFindUser, FoundUserFromParams, SuspendListValidation, ModifySuspendListData);

router.delete('/User/id=:id', ...LoginAndFindUser, FoundUserFromParams, DeleteUser);

export default router;