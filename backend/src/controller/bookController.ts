import { Request, Response } from 'express'
import { CreateBook, FindBookByID, FindBookByIDAndDelete, FindBookByIDAndUpdate } from '../schema/book/book';
import { AuthRequest, EditImageInterface, externalDataInterface } from '../model/requestInterface';
import { deleteImage } from '../storage';
import { BookInterface } from '../model/bookSchemaInterface';
import { FindBookLoanedAndDelete } from '../schema/book/bookLoaned';
import { FindBookFavouriteAndDeleteMany } from '../schema/book/bookFavourite';

import fs from "fs/promises";
import path from 'path';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL as string;

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


export const GetBookImage = async (req: Request, res: Response) => 
{
    const { filename } = req.params;
    const filePath = path.resolve(__dirname, '../upload', filename as string);

    res.sendFile(filePath, (error) => 
    {
        if (error && !res.headersSent) 
        {
            return res.status(404).json({ error: "Image not found" });
        }
    });
};

export const CreateBookRecord = async (req:Request, res:Response) => 
{
    const { bookname, languageID, genreID, authorID, publisherID, description, publishDate } = req.body;
    let success = false;
    let createdBookId;

    try
    {
        const imageName = req.file ? `${Date.now()}-${req.file.originalname}` : null;
        const imageUrl = imageName ? `${BACKEND_BASE_URL}/api/book/uploads/${imageName}`: null;
        const mongoDate = new Date(publishDate);

        // Add imageUrl to each book
        const createBook = await CreateBook({ image: {url:imageUrl, filename:imageName}, bookname, languageID, genreID, authorID, publisherID, description, publishDate:mongoDate });

        if(!createBook)
        {
            return res.status(400).json({success, error: "Failed to create book record"});
        }

        createdBookId = createBook._id;

        if(req.file && imageName)
        {
            const uploadPath = path.join(__dirname, '../upload', imageName);
            await fs.writeFile(uploadPath, req.file.buffer);
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
            const newPath = path.join(__dirname, '../upload', newImageName);
            
            await fs.writeFile(newPath, req.file.buffer);

            if (oldImageName) 
            {
                await deleteImage(oldImageName);
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
            deleteImage(bookRecord.image.filename);
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
        
        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const baseUrl = process.env.GOOGLE_BOOKS_BASE_URL; 

        const query = `${bookname} inauthor:${author}`;
        const url = `${baseUrl}?q=${query}&key=${apiKey}`;

        const response = await fetch(url);
        const result = await response.json() as externalDataInterface;
        let externalBookData =  { averageRating: "N/A", ratingsCount: "N/A", categories: "N/A", saleability: "N/A", listPrice: "N/A", retailPrice: "N/A", 
            ISBN_13_Code: "N/A", ISBN_10_Code:"N/A"};

        if (result?.items?.length && (result.totalItems ?? 0) >= 0)
        {
            const book = result.items[0];
            const volumeInfo = book.volumeInfo || {};
            const saleInfo = book.saleInfo || {};
                
            const saleability = saleInfo.saleability;
            const identifiers = volumeInfo.industryIdentifiers || [];
                
            externalBookData = 
            {
                averageRating: volumeInfo.averageRating ? `${volumeInfo.averageRating} (From Google Books)` : "N/A",
                ratingsCount: volumeInfo.ratingsCount ? `${volumeInfo.ratingsCount}` : "N/A",
                categories: volumeInfo.categories ? `${volumeInfo.categories}` : "N/A",
                saleability: saleability ?? "N/A",
                listPrice: "N/A",
                retailPrice: "N/A",
                ISBN_13_Code: identifiers.find(item => item.type === "ISBN_13")?.identifier ?? "N/A",
                ISBN_10_Code: identifiers.find(item => item.type === "ISBN_10")?.identifier ?? "N/A"
            };

            if (saleability !== "NOT_FOR_SALE") 
            {
                externalBookData.listPrice = saleInfo.listPrice?.amount ? `${saleInfo.listPrice.currencyCode}$${saleInfo.listPrice.amount}` : "N/A";
                externalBookData.retailPrice = saleInfo.retailPrice?.amount ? `${saleInfo.retailPrice.currencyCode}$${saleInfo.retailPrice.amount}` : "N/A";
            }
        }

        res.json({success: true, foundExternalBook: externalBookData});
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        res.status(500).json({ success: false, error: 'Internal Server Error!' });
    }
}