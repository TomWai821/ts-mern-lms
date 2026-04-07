import { Request, Response } from 'express'
import { CreateBook, FindBookByID, FindBookByIDAndDelete, FindBookByIDAndUpdate } from '../schema/book/book';
import { AuthRequest, EditImageInterface } from '../model/requestInterface';
import { BookInterface } from '../model/bookSchemaInterface';
import { FindBookLoanedAndDelete } from '../schema/book/bookLoaned';
import { FindBookFavouriteAndDeleteMany } from '../schema/book/bookFavourite';

import { externalBookService } from '../service/book/externalBookService';
import { ImageDataBuilder, UploadImage } from '../service/image/bookCreateImageService';
import { HandleDeleteImage } from '../service/image/bookDeleteImageService';
import { getStorageStrategy } from '../storage/StorageFactory';

export const GetBookRecord = async (req: AuthRequest, res: Response) => 
{
    try 
    {
        const foundBook = req.foundBook;
        return res.json({ success: true, foundBook: foundBook });
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

export const CreateBookRecord = async (req:Request, res:Response) => 
{
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;
    let createdBookId;

    try
    {
       const imageData = await ImageDataBuilder(req.file as Express.Multer.File, publishDate);

        // Add imageUrl to each book
        const createBook = await CreateBook({ image: {url:imageData.image.url, filename:imageData.image.filename}, bookname, languageID, genreID, authorID, publisherID, description, publishDate:imageData.publishDate });

        if(!createBook)
        {
            return res.status(400).json({success, error: "Failed to create book record"});
        }

        createdBookId = createBook._id;

        if(req.file && imageData.image.filename)
        {
            await UploadImage(req.file as Express.Multer.File, imageData.image.filename);
        }

        success = true;
        res.json({success, message: "Book Record Create Successfully!"});
    }
    catch(error)
    {
        if(createdBookId)
        {
            await FindBookByIDAndDelete(createdBookId as unknown as string);
            console.log(`Failed to upload Image!`);
        }
        console.log(error);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
}

export const EditBookRecord = async (req: AuthRequest, res: Response) => 
{
    const bookID = req.params.id;
    const { isImageChanged, oldImageName, newImageName, newImageUrl} = req.editImageData as EditImageInterface;
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;

    try 
    {
        const updateBookRecord = await FindBookByIDAndUpdate(bookID as string, {$set: {image: { url: newImageUrl, filename: newImageName }, bookname, languageID, 
            genreID, authorID, publisherID, description, publishDate:new Date(publishDate) }});

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

export const DeleteBookRecord = async(req:Request, res:Response) => 
{
    const bookID = req.params.id;
    let success = false;

    try
    {
        const bookRecord = await FindBookByID(bookID as string) as BookInterface;

        if (!bookRecord) 
        {
            return res.status(404).json({ success, error: "Book not found" });
        }

        const results = await Promise.allSettled([
            FindBookLoanedAndDelete({ bookID }),
            FindBookFavouriteAndDeleteMany({ bookID }),
            FindBookByIDAndDelete(bookID as string)
        ]);

        const [loanResult, favouriteResult, bookResult] = results;

        if (bookResult.status === 'rejected') 
        {
            return res.status(500).json({ success: false,  error: "Database error during book deletion (Partial data may remain)" })
        };

        if (loanResult.status === 'rejected' || favouriteResult.status === 'rejected') 
        {
            console.warn(`Book ${bookID} deleted, but some related records failed to clean up`);
        }

        if (bookResult.status === 'fulfilled') 
        {
            await HandleDeleteImage(bookRecord.image.filename);
        }

        success = true;
        res.json({success, message: "Book Record Delete Successfully!"});
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success, error: 'Internal Server Error!' });
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