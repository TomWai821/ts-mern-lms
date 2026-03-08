import { Response } from 'express'
import { AuthRequest } from '../model/requestInterface';
import { CreateBookFavourite, FindBookFavouriteByIDAndDelete } from '../schema/book/bookFavourite';

export const CreateFavouriteBookRecord = async (req:AuthRequest, res:Response) => 
{
    let success = false;
    const userID = req.user?._id;
    const { bookID } = req.body;

    try
    {
        const CreateFavouriteBook = await CreateBookFavourite({userID, bookID});

        if(!CreateFavouriteBook)
        {
            return res.status(400).json({success, error: 'Failed to create favourite book record!'});
        }

        success = true;
        res.json({success, message: 'Create favourite book record successfully!'})
    }
    catch(error)
    {
        return res.status(500).json({success, error: 'Internal Server Error!'})
    }
}

export const GetFavouriteBookRecord = async (req:AuthRequest, res:Response) => 
{   
    try
    {
        const foundFavouriteBook = req.foundFavouriteBook;
        res.json({success: true, foundFavouriteBook: foundFavouriteBook});
    }
    catch(error)
    {
        return res.status(500).json({success: false, error: 'Internal Server Error!'})
    }
}

export const DeleteFavouriteBookRecord = async (req:AuthRequest, res:Response) => 
{
    let success = false;
    const favouriteRecordID = req.params.id;
    
    try
    {
        const DeleteFavrouiteBook = await FindBookFavouriteByIDAndDelete(favouriteRecordID as string);

        if(!DeleteFavrouiteBook)
        {
            return res.status(400).json({success, error: 'Failed to delete favourite book record!'});
        }

        success = true;
        res.json({success, message: 'Delete favourite book record successfully!'})
    }
    catch(error)
    {
        return res.status(500).json({success, error: 'Internal Server Error!'})
    }
}