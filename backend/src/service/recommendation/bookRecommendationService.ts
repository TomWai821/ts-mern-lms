import { GetBook } from "../../schema/book/book";
import { DynamoDBTableMap, GetDataFromDynamoDB, PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";
import { RecommendBookType } from "../../controller/bookRecommendationController";
import { getRecommendedBooksForUserService } from "./recommendationEngine";
import { GetBookLoaned } from "../../schema/book/bookLoaned";

export const GetBookRecommendationService = async (recommendType: RecommendBookType, userId?: string) => 
{
    if(recommendType === "forUser" && !userId)
    {
        return {success: false, statusCode: 400, message: "This suggestion type requires authToken!"};
    }

    const cacheResult = await GetDataFromDynamoDB("RecommendBook", recommendType, userId);
    let foundBook = cacheResult.Item?.data as DynamoDBTableMap["RecommendBook"][typeof recommendType] | undefined;

    if(!foundBook)
    {
        foundBook = await RefreshRecommendation(recommendType, userId);
    }

    return {success: true, statusCode: 200, foundBook};
};

const RefreshRecommendation = async (recommendType: RecommendBookType, userId?: string) =>
{
    let freshData = [];

    switch (recommendType)
    {
        case "newPublish":
            freshData = await GetBook(undefined, { publishDate: -1 }, 8);
            return saveRecommendation(recommendType, freshData);

        case "mostPopular":
            freshData = await GetBookLoaned(undefined, 8);
            return saveRecommendation(recommendType, freshData);

        case "forUser":
            if (!userId)
            {
                throw new Error("userId required for user recommendations");
            }

            freshData = await getRecommendedBooksForUserService(userId);
            return saveRecommendation(recommendType, freshData, userId);

        default:
            throw new Error(`Unsupported recommendation type: ${recommendType}`);
    }
    
};

const saveRecommendation = async (suggestType: RecommendBookType, freshData: any, userId?: string) =>
{
    await PutDataIntoDynamoDB("RecommendBook", suggestType, freshData, userId);
    return freshData;
};

export const RefreshRecommendationCache = async (suggestType: RecommendBookType, userId?: string): Promise<void> =>
{
    await RefreshRecommendation(suggestType, userId);
};
