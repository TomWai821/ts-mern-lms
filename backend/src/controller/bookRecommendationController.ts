import { GetBookRecommendationService } from "../service/book/bookRecommendationService";
import { AuthRequest } from "../model/requestInterface";
import { Response } from "express";

export type RecommendBookType = "newPublish" | "forUser" | "mostPopular"

export const GetRecommendBookController = async (req: AuthRequest, res: Response) => 
{
    const suggestType = req.params.type as RecommendBookType;
    const userId = req.user?._id as unknown as string;
  
    try
    {
        const {success, statusCode, foundBook, message} = await GetBookRecommendationService(suggestType, userId);
        const responseData = message ? {success, message} : {success, foundBook: foundBook};
        return res.status(statusCode).json(responseData);
    } 
    catch (error) 
    {
        console.error("Get Suggest Book Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};