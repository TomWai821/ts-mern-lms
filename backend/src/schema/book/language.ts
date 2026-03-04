import mongoose from 'mongoose';
import { LanguageInterface } from '../../model/bookSchemaInterface';
import { printError } from '../../controller/Utils';

const languageSchema = new mongoose.Schema<LanguageInterface>
(
    {
        language: { type: String, required:true, unique: true },
        shortName: { type: String, require: true, unique: true }
    }
)

const Language = mongoose.model<LanguageInterface>('Language', languageSchema);

export const CreateLanguage = async (data:Record<string, any>) => 
{
    try
    {
        return await Language.create(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const GetLanguage = async (data?:Record<string, any>) =>
{
    try
    {
        if(!data)
        {
            return await Language.find({});
        }
        return await Language.find(data);
    }
    catch(error)
    {
        printError(error);
    }

};
        
export const FindLanguage = async (data: Record<string, any>) => 
{
    try
    {
        return await Language.findOne(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindLanguageByID = async (languageID: string, select?: Record<string, any>) => 
{
    try
    {
        if(select)
        {
            return await Language.findById(languageID).select(select);
        }
        return await Language.findById(languageID);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindLanguageByIDAndUpdate = async (languageID: string, data: Record<string, any>) => 
{
    try
    {
        return await Language.findByIdAndUpdate(languageID, data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindLanguageByIDAndDelete = async (languageID: string) =>
{
    try
    {
        return await Language.findByIdAndDelete(languageID);
    }
    catch(error)
    {
        printError(error);
    }
}