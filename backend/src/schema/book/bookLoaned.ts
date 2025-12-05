import mongoose, { ObjectId, PipelineStage } from "mongoose";
import { BookLoanedInterface } from "../../model/bookSchemaInterface";
import { lookupAndUnwind, printError } from "../../controller/Utils";
import { bookReturnStatus, finesPaidStatus } from "../../Arrays/Types";

const BookLoanedSchema = new mongoose.Schema<BookLoanedInterface>
(   
    {
        userID: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        bookID: { type: mongoose.Types.ObjectId, ref: 'Book', required: true },
        loanDate: { type:Date, required: true },
        dueDate: { type:Date, required: true },
        returnDate: { type:Date, default: null },
        status: { type:String, enum: bookReturnStatus, default: 'Loaned'},
        fineAmount: { type:Number, default: 0 },
        finesPaid: { type:String, enum: finesPaidStatus, default: "Not Fine Needed" }
    }
)

const BookLoaned = mongoose.model<BookLoanedInterface>('BookLoaned', BookLoanedSchema);

export const CreateBookLoaned = async (data:Record<string, any>) =>
{
    try
    {
        return await BookLoaned.create(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const GetBookLoaned = async (data?:Record<string, any>, limit?:number) =>
{
    try
    {
        if(limit)
        {
            return await GetSuggestBookDetails(data, limit);
        }
        return await GetBooksWithOtherDetails(data);
    }
    catch(error)
    {
        printError(error);
    }
};

// Local variable(For get banned user data)
const GetBooksWithOtherDetails = async (data?:Record<string, any>) => 
{
    let pipeline:PipelineStage[] = [];

    pipeline.push(
        ...lookupAndUnwind('users', 'userID', '_id', 'userDetails'),
        ...lookupAndUnwind('books', 'bookID', '_id', 'bookDetails'),
        ...lookupAndUnwind('authors', 'bookDetails.authorID', '_id', 'authorDetails'),
        ...lookupAndUnwind('publishers', 'bookDetails.publisherID', '_id', 'publisherDetails'),
        ...lookupAndUnwind('genres', 'bookDetails.genreID', '_id', 'genreDetails'),
        ...lookupAndUnwind('languages', 'bookDetails.languageID', '_id', 'languageDetails')
    );

    if (data) { pipeline.push( {$match: {...data}} )}
    return await BookLoaned.aggregate(pipeline);
}
 
const GetSuggestBookDetails = async (data?: Record<string, any>, limit?: number) => 
{
    let pipeline: PipelineStage[] = [];

    if (data) { pipeline.push({ $match: { ...data } })}

    pipeline.push({ $group: { _id: "$bookID", count: { $sum: 1 } }});

    pipeline.push({ $sort: { count: -1 } });

    if (limit) {pipeline.push({ $limit: limit });}

    pipeline.push(
        ...lookupAndUnwind('users', '_id', '_id', 'userDetails'),
        ...lookupAndUnwind('books', '_id', '_id', 'bookDetails'),
        ...lookupAndUnwind('authors', 'bookDetails.authorID', '_id', 'authorDetails'),
        ...lookupAndUnwind('publishers', 'bookDetails.publisherID', '_id', 'publisherDetails'),
        ...lookupAndUnwind('genres', 'bookDetails.genreID', '_id', 'genreDetails'),
        ...lookupAndUnwind('languages', 'bookDetails.languageID', '_id', 'languageDetails'),
    );

    pipeline.push({ $unwind: { path: "$bookDetails",  preserveNullAndEmptyArrays: true }});

    return await BookLoaned.aggregate(pipeline);
};

        
export const FindBookLoaned = async (data: Record<string, any>) =>
{
    try
    {
        return await BookLoaned.findOne(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookLoanedByID = async (bookLoanedId: string, select?: Record<string, any>) =>
{
    try
    {
        if(select)
        {
            return await BookLoaned.findById(bookLoanedId).select(select);
        }
        return await BookLoaned.findById(bookLoanedId);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookLoanedByIDAndUpdate  = async (bookLoanedId: string, data: Record<string, any>) =>
{
    try
    {
        return await BookLoaned.findByIdAndUpdate(bookLoanedId, data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookLoanedByIDAndDelete = async (bookLoanedId: string, data: Record<string, any>) =>
{
    try
    {
        return await BookLoaned.findByIdAndDelete(bookLoanedId, data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const FindBookLoanedAndDelete = async (data: Record<string, any>) =>
{
    try
    {
        return await BookLoaned.deleteMany(data);
    }
    catch(error)
    {
        printError(error);
    }
}

export const detectExpiredLoanRecord = async () => 
{
    try
    {
        const currentDate = new Date();

        const loanRecords = await GetBookLoaned({status: 'Loaned'}) as BookLoanedInterface[];

        const expiresLoanRecords = loanRecords.filter( bookLoaned => 
            {
                const dueDate = new Date(bookLoaned.dueDate);
                const effectiveDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() + 1)
                return effectiveDueDate < currentDate;
            }
        )

        if(expiresLoanRecords.length > 0)
        {
            console.log(`Totally has ${expiresLoanRecords.length} loan book records were expired`);

            for(const bookLoaned of expiresLoanRecords)
            {
                const modifyFinesPaidStatus = await FindBookLoanedByIDAndUpdate(bookLoaned._id as unknown as string, {finesPaid: 'Not Paid', finesAmount: 1.5});

                if(!modifyFinesPaidStatus)
                {
                    console.log(`Failed to modify ${bookLoaned._id} loan record finesAmount and Paid status!`)
                }

                console.log(`Loan Record ${bookLoaned._id} fines Amount and paid status modify successfully!`);
            }
        }
    }
    catch(error)
    {
        console.error("Error detecting expired loan records:", error);
    }
}

export const modifyFinesAmount = async() => 
{
    try
    {
        const currentDate = new Date();

        const expiresLoanRecords = await GetBookLoaned({finesPaid: 'Not Paid'}) as BookLoanedInterface[];

        if(expiresLoanRecords.length > 0)
        {
            console.log(`Totally has ${expiresLoanRecords.length} loan records does not paid the fines`);

            for(const bookLoaned of expiresLoanRecords)
            {
                const expireTime = new Date(bookLoaned.dueDate as Date).getTime();
                const diffTime = currentDate.getTime() - expireTime;
                const expireDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                const finesAmount = 1.5 * expireDays < 130 ? 1.5 * expireDays : 130;
                const modifyFinesAmount = await FindBookLoanedByIDAndUpdate(bookLoaned._id as unknown as string, {fineAmount: finesAmount});

                if(!modifyFinesAmount)
                {
                    console.log(`Failed to modify ${bookLoaned._id} loan record finesAmount!`);
                    continue;
                }

                console.log(`Loan Record ${bookLoaned._id} fine Amount ($${1.5 * expireDays}) modify successfully!`);
            }
        }
    }
    catch(error)
    {
        console.error("Error detecting expired suspensions:", error);
    }
}