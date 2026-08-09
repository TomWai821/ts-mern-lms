import { Response } from 'express'
import { GetBookLoaned } from '../schema/book/bookLoaned';
import { AuthRequest } from '../model/requestInterface';
import { BookLoanedInterface } from '../model/bookSchemaInterface';
import { ObjectId } from 'mongodb';
import { buildLoanedQuery } from '../middleware/Book/bookValidationMiddleware';

import { CreateLoanBookRecordService } from '../service/loanBook/loanBookCreateDataService';
import { LoanBookRecordUpdateService } from '../service/loanBook/loanBookUpdateDataService';

export const GetLoanBookRecord = async (req: AuthRequest, res:Response) => 
{
    const recordType = req.params.type;
    const {bookname, username, status, finesPaid} = req.query;
    const userId = req.user?._id;
    let success = false;
    
    try
    {
        let getLoanRecord:any[] | undefined;
        let query = {};

        if (req.query && Object.keys(req.query).length > 0) 
        {
            query = buildLoanedQuery({ bookname, username, status, finesPaid });
        }

        switch(recordType)
        {
            case "AllUser":
                // Get the whole user record
                getLoanRecord = await GetBookLoaned({...query});
                break;

            case "Self":
                // Get the own record only
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
    const librarianUserID = req.user?._id;
    let success = false;
    
    try
    {
        const {success, statusCode, error, message} = await CreateLoanBookRecordService(userID, librarianUserID as unknown as string, bookID, loanDate, dueDate);

        if(!success)
        {
            res.status(statusCode).json({ success, error });
        }

        res.status(statusCode).json({success, message});
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
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
        const {success, statusCode, error, message} = await LoanBookRecordUpdateService(foundLoanedRecord, finesPaid);

        if(!success)
        {
            res.status(statusCode).json({ success, error });
        }

        res.status(statusCode).json({success, message})
    }
    catch(error)
    {
        console.error(`Unhandled error: ${error}`);
        return res.status(500).json({success, error: "Internal Server Error!" })
    }
}

