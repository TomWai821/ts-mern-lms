import { AuthIdValidation, AuthRoleValidation, FetchAuthTokenFromCookie } from "../middleware/User/authMiddleware";
import { SuspendListValidation } from "../middleware/User/userValidationMiddleware";

export const LoginAndFindUser = [FetchAuthTokenFromCookie, AuthIdValidation];
export const ValidationForModifyStatus = [SuspendListValidation];
export const ValidateAuthTokenAsAdmin = [FetchAuthTokenFromCookie, AuthIdValidation, AuthRoleValidation(['Admin'])];