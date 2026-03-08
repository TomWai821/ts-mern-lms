import { NextFunction, Response } from "express";
import { jwtVerify } from "../../hashing";
import { AuthRequest } from "../../../model/requestInterface";
import { FindUser } from "../../../schema/user/user";

export const FetchUserFromHeader = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    try 
    {
        const authToken = req.header("authToken");

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
    const userId = await FindUser({_id: req.user?._id});

    if (!userId) 
    {
        return res.status(400).json({ success: false, error: "Invalid auth Token!" });
    }

    next();
}