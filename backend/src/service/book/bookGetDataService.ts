import { GetBook } from "../../schema/book/book";
import { ObjectId } from "mongodb";
import { GetBookFavourite } from "../../schema/book/bookFavourite";

export const GetBookDataService = async (queryParams: Record<string, any>) => 
{
    const hasParams = Object.keys(queryParams).length > 0;
    return hasParams ? await fetchBookData(queryParams) : await GetBook();
};


export const GetFavouriteBookDataService = async (userID: string, queryParams: Record<string, any>) => 
{
    const hasParams = Object.keys(queryParams).length > 0;

    const query = hasParams 
        ? { ...buildQuery("Favourite", queryParams), userID: new ObjectId(userID) }
        : { userID: new ObjectId(userID) };

    return await GetBookFavourite(query);
};


const fetchBookData = async (queryParams: any) => 
{
    const query = buildQuery("All", queryParams);
    return await GetBook(query);
};

const buildQuery = (type:string, queryParams: any) => 
{
    const { bookname, status, genreID, languageID, publisherID, authorID } = queryParams;
    let query = {};

    switch(type)
    {
        case "All":
            query = 
                {
                    ...(bookname && { "bookname": { $regex: bookname, $options: "i" } }),
                    ...(status && { "status": status }),
                    ...(genreID && { "genreID": new ObjectId(genreID) }),
                    ...(languageID && { "languageID": new ObjectId(languageID) }),
                    ...(publisherID && { "publisherID": new ObjectId(publisherID) }),
                    ...(authorID && { "authorID": new ObjectId(authorID) }),
                };
            break;

        case "Favourite":
            query = 
                {
                    ...(bookname && { "bookDetails.bookname": { $regex: bookname, $options: "i" } }),
                    ...(status && { "bookDetails.status": status }),
                    ...(genreID && { "bookDetails.genreID": new ObjectId(genreID) }),
                    ...(languageID && { "bookDetails.languageID": new ObjectId(languageID) }),
                    ...(publisherID && { "bookDetails.publisherID": new ObjectId(publisherID) }),
                    ...(authorID && { "bookDetails.authorID": new ObjectId(authorID) }),
                };
            break;
    }
    
    return query;
};