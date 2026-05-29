import { NextFunction, Response } from "express";
import { AuthRequest } from "../../model/requestInterface";
import { GetBookDataService } from "../../service/book/bookGetDataService";

export const GetBookDataMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    try 
    {
        const foundBook = await GetBookDataService(req.query);

        if (!foundBook) 
        {
            return res.status(404).json({ success: false, error: "Could not find any books." });
        }

        req.foundBook = foundBook;
        next();
    } 
    catch (error) 
    {
        console.error("GetBookDataMiddleware Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
