import { Request, Response } from 'express'
import { FindBookByIDAndUpdate } from '../schema/book/book';
import { AuthRequest, EditImageInterface } from '../model/requestInterface';

import { externalBookService } from '../service/book/externalBookService';
import { UploadImage } from '../service/image/bookCreateImageService';
import { HandleDeleteImage } from '../service/image/bookDeleteImageService';
import { getStorageStrategy } from '../storage/StorageFactory';
import { BookDeletionService } from '../service/book/bookDeleteDataService';
import { CreateBookRecordService } from '../service/book/bookCreateDataService';

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

        const result = await CreateBookRecordService(bookData, req.file as Express.Multer.File);

        res.json({ success: result.success, message: "Book Record Created Successfully!", bookId: result.bookId });
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
    const { isImageChanged, oldImageName, newImageName, newImageUrl} = req.editImageData as EditImageInterface;
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;

    try 
    {
        const updateData: Record<string, any> = { bookname, languageID, genreID, authorID, publisherID, description, publishDate: new Date(publishDate) };

        const updateBookRecord = await FindBookByIDAndUpdate(bookID as string, {$set: {image: { url: newImageUrl, filename: newImageName }, ...updateData }});

        if (!updateBookRecord) 
        {
            return res.status(400).json({ success, error: 'Failed to Update Book Record' });
        }

        if (isImageChanged && req.file) 
        {
            await UploadImage(req.file as Express.Multer.File, newImageName);

            if (oldImageName) 
            {
                await HandleDeleteImage(oldImageName);
            }
        }

        success = true;
        return res.json({ success, message: 'Book Record Updated Successfully!' });
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
        const { success, error, status } = await BookDeletionService(bookID as string);
        
        // 2. Send the response (Based on the service result)
        if (!success) 
        {
            return res.status(status).json({ success: false, error });
        }

        return res.json({ success: true, message: "Book Record Delete Successfully!" });

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