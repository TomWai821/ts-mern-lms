// middleware/bookMiddleware.ts
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../model/requestInterface";
import { GetFavouriteBookDataService } from "../../service/book/bookGetDataService";


export const GetFavouriteBookDataMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    try 
    {
        const userID = req.user?._id.toString();

        if (!userID) 
        {
            return res.status(400).json({ success: false, error: "Missing user ID" });
        }

        const foundBook = await GetFavouriteBookDataService(userID, req.query);

        if (!foundBook) 
        {
            return res.status(404).json({ success: false, error: "Could not find any books" });
        }

        req.foundFavouriteBook = foundBook;
        next();
    } 
    catch (error) 
    {
        console.error("GetFavouriteBookDataMiddleware Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

