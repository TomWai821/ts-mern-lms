import { Request, Response } from 'express';
import { AuthRequest, CreateUserInterface } from '../model/requestInterface';
import { jwtSign} from './hashing'
import { UserInterface } from '../model/userSchemaInterface';
import { FindUserByID } from '../schema/user/user';
import { broadcast, UserEvent } from '../ws';
import { Schema } from 'mongoose';
import { RegisterService } from '../service/auth/LoginService';
import { RefreshDashboard } from '../service/dashboard/dashboardService';

export const UserRegister = async(req: Request, res: Response) =>
{
    const { email, username, password, gender, birthDay, role, status }: CreateUserInterface = req.body;
    let success = false;

    try
    {   
        const RegisterData = { email, username, password, gender, birthDay, role, status };
        const {message, newUser, data} = await RegisterService(RegisterData);

        if (!newUser)
        {
            return res.status(400).json({ success: false, message: message });
        }
        
        // Get user id after create the user and Transfer user id as authToken with jsonWebToken
        await CookieAuthTokenHandler(res, data);
        broadcast(UserEvent.USER_CREATE, newUser);
        void RefreshDashboard("users");

        res.status(200).json({ success: true, message: "Register Successfully!"})
    }
    catch (error) 
    { 
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
}

export const UserLogin = async (req: AuthRequest, res: Response) =>
{
    const user = req.user as UserInterface;
    const stayLogin = req.body.stayLogin ?? false;
    let success = false;
    
    try 
    {
        const data = { user: { _id: user._id } };
    
        await CookieAuthTokenHandler(res, data, stayLogin);

        res.json({ success: true, message: "Login Successfully!"});
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
};


type UserDataType = {user: {_id: Schema.Types.ObjectId;}}

const CookieAuthTokenHandler = async (res: Response, data: UserDataType, stayLogin: boolean = false) => 
{
    const cookieAge = stayLogin ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

    const authToken: string = await jwtSign(data);

    res.cookie("authToken", authToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: cookieAge
        }
    );
}


export const UserLogout = async (req: Request, res: Response) =>
{
    res.clearCookie("authToken",
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        }
    );

    return res.json({ success: true, message: "Logout Successfully" });
};

export const GetSelfRecord = async(req: AuthRequest, res: Response) =>
{
    let success = false;
    const userId = req.user?._id;

    try
    {
        const user = await FindUserByID(userId as unknown as string);

        if(!user)
        {
            return res.status(404).json({ success });
        }

        return res.json({ success: true, data:{ username: user.username, role: user.role, status: user.status, avatarUrl: user.avatarUrl, email: user.email, gender: user.gender } });
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success });
    }
};


export const QRCodeHandler = async(req: AuthRequest, res: Response) =>
{
    let success = false;
    const userId = req.user?._id;
    
    try
    {
        const user = await FindUserByID(userId as unknown as string);

        if(!user)
        {
            return res.status(404).json({ success });
        }

        const payload = { userId: userId, username: user.username, type: "library-member" };

        return res.json({ success: true, data: payload });
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({ success });
    }
};