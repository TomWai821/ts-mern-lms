import { Request, Response } from 'express'
import { CreateBook, FindBookByID, FindBookByIDAndDelete, FindBookByIDAndUpdate } from '../schema/book/book';
import { AuthRequest } from '../model/requestInterface';
import { deleteImage } from '../storage';
import fs from 'fs'
import { BookInterface } from '../model/bookSchemaInterface';
import { FindBookLoanedAndDelete } from '../schema/book/bookLoaned';
import { FindBookFavouriteAndDeleteMany } from '../schema/book/bookFavourite';

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

export const GetBookImage = async(req:Request, res:Response) => 
{
    const { filename } = req.params; 
    const filePath = `./src/upload/${filename}`;

    fs.access(filePath, fs.constants.F_OK, (err) => 
    {
        if (err) 
        {
            return res.status(404).json({ error: "File not found" });
        }

        res.sendFile(filePath, { root: "." });
    });
}

export const CreateBookRecord = async (req:Request, res:Response) => 
{
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;
    console.log(req.body);

    try
    {
        const imageName = req.file?.filename;
        const imageUrl = imageName ? `http://localhost:5000/api/book/uploads/${imageName}`: null;
        const mongoDate = new Date(publishDate);

        // Add imageUrl to each book
        const createBook = await CreateBook({ image: {url:imageUrl, filename:imageName}, bookname, languageID, genreID, authorID, publisherID, description, publishDate:mongoDate });

        if(!createBook)
        {
            return res.status(400).json({success, error: "Failed to create book record"});
        }

        success = true;
        res.json({success, message: "Book Record Create Successfully!"});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
}

export const EditBookRecord = async (req: Request, res: Response) => 
{
    const bookID = req.params.id;
    const { bookname, imageName, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;

    try 
    {
        const bookData = await FindBookByID(bookID) as BookInterface;
        const ImageName = bookData.image.filename;
        const ImageUrl = bookData.image.url;

        const newImageName = ImageName === imageName ? ImageName : req.file?.filename ?? ImageName;
        const imageUrl = ImageName === imageName ? ImageUrl : `http://localhost:5000/api/book/uploads/${newImageName}`;

        if (ImageName !== imageName) 
        {
            try 
            {
                await deleteImage(imageName);
            } 
            catch (error) 
            {
                if (error instanceof Error) 
                {
                    return res.status(400).json({ success: false, error: error.message });
                } 
                else 
                {
                    return res.status(400).json({ success: false, error: 'An unknown error occurred during image deletion' });
                }
            }
        }
    
        const updateBookRecord = await FindBookByIDAndUpdate(bookID, {$set: {image: { url: imageUrl, filename: newImageName }, bookname, languageID, 
            genreID, authorID, publisherID, description, publishDate:new Date(publishDate) }});

        if (!updateBookRecord) 
        {
            return res.status(400).json({ success, error: 'Failed to Update Book Record' });
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
        const deleteLoanBookRecord = await FindBookLoanedAndDelete({bookID: bookID});

        if(!deleteLoanBookRecord)
        {
            return res.status(400).json({success, error: "Failed to Delete loaned book record"});
        }

        const deleteFavouriteBookRecord = await FindBookFavouriteAndDeleteMany({bookID: bookID});

        if(!deleteFavouriteBookRecord)
        {
            return res.status(400).json({success, error: "Failed to Delete favourite book record"});
        }

        const deleteBookRecord = await FindBookByIDAndDelete(bookID);

        if(!deleteBookRecord)
        {
            return res.status(400).json({success, error: "Failed to Delete book record"});
        }
        success = true;
        res.json({success, message: "Book Record Delete Successfully!"});
    }
    catch(error)
    {
        res.status(500).json({ success, error: 'Internal Server Error!' });
    }
}