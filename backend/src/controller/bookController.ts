import { Request, Response } from 'express'
import { AuthRequest, EditImageInterface } from '../model/requestInterface';

import { externalBookService } from '../service/book/externalBookService';

import { getStorageStrategy } from '../storage/StorageFactory';
import { BookDeletionService } from '../service/book/bookDeleteDataService';
import { CreateBookRecordService } from '../service/book/bookCreateDataService';

import { BookUpdateDataService } from '../service/book/bookUpdateDataService';
import { BookInterface } from '../model/bookSchemaInterface';

export const GetBookRecord = (req: AuthRequest, res: Response) => 
{
    try 
    {
        return res.json({ success: true, foundBook: req.foundBook });
    } 
    catch (error) 
    {
        console.error("Error in GetBookRecord:", error);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
};


export const GetImageController = (req: Request, res: Response) =>
{
    const { imageName } = req.params;

    if (!imageName) 
    {
        return res.status(400).send("No filename");
    }

    const storage = getStorageStrategy();
    
    return storage.handleResponse(imageName as string, res);
};

export const CreateBookRecord = async (req: Request, res: Response) => 
{
    try 
    {
        const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;

        const bookData = { bookname, languageID, genreID, authorID, publisherID, description, publishDate };

        const {success, statusCode, error, message} = await CreateBookRecordService(bookData, req.file as Express.Multer.File);
        
        if(!success)
        {
            res.status(statusCode).json({ success, error });
        }

        res.status(statusCode).json({ success, message });
    } 
    catch (error) 
    {
        console.error("CreateBookRecord Error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
};


export const EditBookRecord = async (req: AuthRequest, res: Response) => 
{
    const bookID = req.params.id;
    const editImageData = req.editImageData as EditImageInterface;
    const editBookData = req.body;
    const fileData = req.file;
    let success = false;

    try 
    {
        const {success, statusCode, error, message} = await BookUpdateDataService(bookID as string, editBookData as BookInterface, editImageData as EditImageInterface, fileData);

        if(!success)
        {
            res.status(statusCode).json({ success, error });
        }

        return res.status(statusCode).json({ success, message });
    } 
    catch (error) 
    {
        console.error('Error updating book record:', error);
        return res.status(500).json({ success, error: 'Internal Server Error!' });
    }
};

export const DeleteBookRecord = async (req: Request, res: Response) => 
{
    const bookID = req.params.id;

    try 
    {
        // 1. Call the encapsulated service (Handle the entire deletion process)
        const { success, statusCode, error, message  } = await BookDeletionService(bookID as string);

        if(!success)
        {
            res.status(statusCode).json({ success, error });
        }
        
        res.status(statusCode).json({ success, message });
    } 
    catch (error) 
    {
        console.error(`Unhandled controller error: ${error}`);
        return res.status(500).json({ success: false, error: 'Internal Server Error!' });
    }
}


export const GetDataFromGoogleBook = async (req:Request, res:Response) => 
{
    try
    {
        const {bookname, author} = req.query;
        
        const externalBookData = await externalBookService(bookname as string, author as string);

        res.json({success: true, foundExternalBook: externalBookData});
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success: false, error: 'Internal Server Error!' });
    }
}