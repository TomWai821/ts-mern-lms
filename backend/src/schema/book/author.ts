import mongoose from 'mongoose';
import { AuthorInterface } from '../../model/bookSchemaInterface';
import { printError } from '../../controller/Utils';

const authorSchema = new mongoose.Schema<AuthorInterface>
(
    {
        author: { type: String, required: true, unique: true },
        phoneNumber: { type: String, default: "N/A" },
        email: { type:String, default: "N/A" }
    }
)

const Author = mongoose.model<AuthorInterface>('Author', authorSchema);

export const CreateAuthor = async (data:Record<string, any>) => 
{
    try
    {
        return await Author.create(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const GetAuthor = async (data?:Record<string, any>) =>
{
    try
    {
        if(!data)
        {
            return await Author.find({});
        }
        return await Author.find(data);
    }
    catch(error)
    {
        printError(error);
    }

};
        
export const FindAuthor = async (data: Record<string, any>) => 
{
    try
    {
        return await Author.findOne(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindAuthorByID = async (authorID: string, select?: Record<string, any>) => 
{
    try
    {
        if(select)
        {
            return await Author.findById(authorID).select(select);
        }
        return await Author.findById(authorID);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindAuthorByIDAndUpdate = async (authorID: string, data: Record<string, any>) => 
{
    try
    {
        return await Author.findByIdAndUpdate(authorID, data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindAuthorByIDAndDelete = async (authorID: string) =>
{
    try
    {
        return await Author.findByIdAndDelete(authorID);
    }
    catch(error)
    {
        printError(error);
    }
}