import { NextFunction, Response } from "express";
import { AuthRequest } from "../../model/requestInterface";
import { jwtVerify } from "../../controller/hashing";
import { FindUser } from "../../schema/user/user";

export const FetchAuthTokenFromCookie = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    try 
    {
        const authToken = req.cookies.authToken;

        if(authToken)
        {
            const data = await jwtVerify(authToken);
            req.user = data.user;
        }

        next();
    } 
    catch (error) 
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(401).send({ success: false, error: "Please authenticate using a valid token" });
    }
};

export const AuthIdValidation = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    const userId = req.user?._id;
    
    const user = await FindUser({_id: userId});

    if (!user) 
    {
        return res.status(400).json({ success: false, error: "Invalid auth Token!" });
    }

    next();
}

export const AuthRoleValidation = (allowedRoles: string[]) => 
{
    return async (req: AuthRequest, res: Response, next: NextFunction) => 
    {
        const userId = req.user?._id;

        const userRole = await FindUser({_id: userId, role: {$in: allowedRoles}});

        if (!userRole) 
        {
            return res.status(403).json({ success: false, error: "Insufficient permissions!" });
        }

        next();
    }
}