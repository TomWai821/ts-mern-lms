import { Response } from 'express'
import { CreateBookLoaned, FindBookLoanedByIDAndUpdate, GetBookLoaned } from '../schema/book/bookLoaned';
import { AuthRequest } from '../model/requestInterface';
import { FindBookByIDAndUpdate } from '../schema/book/book';
import { BookLoanedInterface } from '../model/bookSchemaInterface';
import { ObjectId } from 'mongodb';
import { buildLoanedQuery } from './middleware/Book/bookValidationMiddleware';
import { jwtVerify } from './hashing';
export const GetLoanBookRecord = async (req: AuthRequest, res:Response) => 
{
    const suggestType = req.params.type;
    const {bookname, username, status, finesPaid} = req.query;
    const userId = req.user?._id;
    let success = false;
    
    try
    {
        let getLoanRecord:any[] | undefined;
        let query = {};

        switch(suggestType)
        {
            case "mostPopular": 
                getLoanRecord = await GetBookLoaned(undefined, 8);
                break;

            case "AllUser":
                if(req.query && Object.keys(req.query).length > 0)
                {  
                    query = buildLoanedQuery({bookname, username, status, finesPaid});
                }
                getLoanRecord = await GetBookLoaned({...query});
                break;

            default:
                if(req.query && Object.keys(req.query).length > 0)
                {  
                    query = buildLoanedQuery({bookname, username, status, finesPaid});
                }
                let userObjectId = new ObjectId(userId as unknown as ObjectId);
                getLoanRecord = await GetBookLoaned({userID: userObjectId, ...query});
                break;
        }

        if(!getLoanRecord)
        {
            return res.status(400).json("Failed to Get Loaned Book Record");
        }

        success = true;
        res.json({success, foundLoanBook: getLoanRecord})
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success, error: "Internal Server Error!" })
    }
}

export const CreateLoanBookRecord = async (req: AuthRequest, res:Response) => 
{
    const {userID, bookID, loanDate, dueDate} = req.body;
    const id = req.user?._id;
    let success = false;
    
    try
    {
        const data = await jwtVerify(userID);
        const userId = data.user?._id;
        const UserID = userID ? userId : id;
        const createLoanRecord = await CreateBookLoaned({userID:UserID, bookID, loanDate, dueDate})

        if(!createLoanRecord)
        {
            return res.status(400).json({success, error:"Failed to create Loaned Book Record"});
        }

        const changeBookState = await FindBookByIDAndUpdate(bookID, {status: 'Loaned'})

        if(!changeBookState)
        {
            return res.status(400).json({success, error:"Failed to change Book status"});
        }

        success = true;
        res.json({success, message: "Create Loaned Book Record Successfully!"})
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({success, error: "Internal Server Error!" })
    }
}

export const UpdateLoanBookRecord = async (req: AuthRequest, res:Response) => 
{
    const foundLoanedRecord = req.foundLoanedRecord as BookLoanedInterface;
    const { finesPaid } = req.body;
    let success = false;

    try
    {
        const currentDate = new Date();
        const dueDate = new Date(foundLoanedRecord.dueDate); 
        
        const status = dueDate && currentDate <= dueDate ? 'Returned' : 'Returned(Late)';

        const changeLoanRecordStatus = await FindBookLoanedByIDAndUpdate(foundLoanedRecord._id as unknown as string, {status: status, returnDate: currentDate, finesPaid: finesPaid})

        if(!changeLoanRecordStatus)
        {
            return res.status(400).json({success, error: "Failed to return Book"});
        }

        const changeBookStatus = await FindBookByIDAndUpdate(foundLoanedRecord.bookID as unknown as string, {status: 'OnShelf'});

        if(!changeBookStatus)
        {
            return res.status(400).json({success, error:"Failed to change Book status!"});
        }

        success = true;
        res.json({success, message: "Return Loan Book Successfully!"})
    }
    catch(error)
    {
        return res.status(500).json({success, error: "Internal Server Error!" })
    }
}

