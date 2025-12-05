import mongoose, { PipelineStage } from "mongoose";
import { BookFavouriteInterface } from "../../model/bookSchemaInterface";
import { lookupAndUnwind, printError } from "../../controller/Utils";

const BookFavouriteSchema = new mongoose.Schema<BookFavouriteInterface>
(   
    {
        userID: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        bookID: { type: mongoose.Types.ObjectId, ref: 'Book', required: true }
    }
)

const BookFavourite = mongoose.model<BookFavouriteInterface>('BookFavourite', BookFavouriteSchema);

export const CreateBookFavourite = async (data:Record<string, any>) =>
{
    try
    {
        return await BookFavourite.create(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const GetBookFavourite = async (data:Record<string, any>) =>
{
    try
    {
        return await GetBooksWithOtherDetails(data);
    }
    catch(error)
    {
        printError(error);
    }
};

const GetBooksWithOtherDetails = async (data?:Record<string, any>) => 
{
    let pipeline:PipelineStage[] = [];

    pipeline.push(
        ...lookupAndUnwind('books', 'bookID', '_id', 'bookDetails'),
        ...lookupAndUnwind('authors', 'bookDetails.authorID', '_id', 'authorDetails'),
        ...lookupAndUnwind('publishers', 'bookDetails.publisherID', '_id', 'publisherDetails'),
        ...lookupAndUnwind('genres', 'bookDetails.genreID', '_id', 'genreDetails'),
        ...lookupAndUnwind('languages', 'bookDetails.languageID', '_id', 'languageDetails'),
    );

    if (data) { pipeline.push( {$match: {...data}} )}

    return await BookFavourite.aggregate(pipeline);
}
 
export const FindBookFavourite = async (data: Record<string, any>) =>
{
    try
    {
        return await BookFavourite.findById(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookFavouriteByID = async (bookFavouriteId: string, select?: Record<string, any>) =>
{
    try
    {
        if(select)
        {
            return await BookFavourite.findById(bookFavouriteId).select(select);
        }
        return await BookFavourite.findById(bookFavouriteId);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookFavouriteAndDeleteMany = async (data: Record<string, any>) =>
{
    try
    {
        return await BookFavourite.deleteMany(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookFavouriteByIDAndDelete = async (bookFavouriteId: string) =>
{
    try
    {
        return await BookFavourite.findByIdAndDelete(bookFavouriteId);
    }
    catch(error)
    {
        printError(error);
    }
}