import { NextFunction, Response, Request } from "express";
import { AuthRequest, LoginInterface } from "../../../model/requestInterface";
import { FindUser, FindUserByID } from "../../../schema/user/user";
import { comparePassword } from "../../hashing";
import { UserInterface } from "../../../model/userSchemaInterface";
import { FindSuspendListByID } from "../../../schema/user/suspendList";

// For user register (not require login)
export const UserRegisterDataValidation = async (req: Request, res: Response, next: NextFunction) => 
{
    const {email, username} = req.body;
    const user = await FindUser({ $or: [{ email:email }, { username:username }] });

    if(user)
    {
        if(user.email === email)
        {
            return res.status(400).json({success: false, error: "Email already in use"});
        }

        if(user.username === username)
        {
            return res.status(400).json({success: false, error: "Username already in use"});
        }
    }

    next();
}

// For user login (not require login)
export const UserLoginDataValidation = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    const { email, password }: LoginInterface = req.body;
    
    const user = await FindUser({ email });
  
    if (!user) 
    {
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    const compare = await comparePassword(password, user.password);

    if (!compare) 
    {
        return res.status(400).json({ successs: false, error: 'Invalid password' });
    }

    if (user.status === "Suspend") 
    {
        return res.status(401).json({ successs: false, error: 'This user was suspend' });
    }

    req.user = user;
    next();
}
    
// for found user with used to modify or delete (Require login)
export const FoundUserFromParams = async (req: AuthRequest, res:Response, next:NextFunction) => 
{
    const userId = req.params.id as unknown as string;
    const foundUser = await FindUserByID(userId);
        
    if (!foundUser) 
    {
        return res.status(404).json({ successs: false, error: "Cannot found this account!" });
    }

    req.foundUser = foundUser as UserInterface;
    next();
}

// Validation for status check
export const CompareUserStatus = async (req: AuthRequest, res: Response, next:NextFunction) => 
{
    const { statusForUserList } = req.body;
    const foundUser = req.foundUser as UserInterface;

    if(statusForUserList === foundUser.status)
    {
        return res.status(400).json({success: false, message:"There are no changes for current status"});
    }

    next();
}

// SuspendList ID validation before doing some action
export const SuspendListValidation = async (req: AuthRequest, res: Response, next:NextFunction) => 
{
    const { banListID } = req.body;

    if(banListID)
    {
        const foundSuspendList = await FindSuspendListByID(banListID);

        if(!foundSuspendList)
        {
            return res.status(404).json({ success: false, error:"Invalid Suspend List ID!"});
        }
    }
    next();
}