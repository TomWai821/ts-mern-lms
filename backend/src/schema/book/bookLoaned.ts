import mongoose, { PipelineStage } from "mongoose";
import { BookLoanedInterface } from "../../model/bookSchemaInterface";
import { lookupAndUnwind, printError, setToMidnight } from "../../Utils";
import { bookReturnStatus, finesPaidStatus } from "../../data/enums";

const BookLoanedSchema = new mongoose.Schema<BookLoanedInterface>
(   
    {
        userID: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        bookID: { type: mongoose.Types.ObjectId, ref: 'Book', required: true },
        loanDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        returnDate: { type: Date, default: null },
        status: { type: String, enum: bookReturnStatus, default: 'Loaned'},
        fineAmount: { type: Number, default: 0 },
        finesPaid: { type: String, enum: finesPaidStatus, default: "Not Fine Needed" }
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

export const GetBookLoaned = async (data?:Record<string, any>, limit?:number, sortRequirements?: Record<string, any>) =>
{
    try
    {
        if(limit)
        {
            return await GetSuggestBookDetails(data, limit, sortRequirements);
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
 
const GetSuggestBookDetails = async (data?: Record<string, any>, limit?: number, sortRequirements?: Record<string, any>) => 
{
    let pipeline: PipelineStage[] = [];

    if (data) { pipeline.push({ $match: { ...data } })}

    pipeline.push({ $group: { _id: "$bookID", count: { $sum: 1 } }});

    if(!sortRequirements)
    {
        sortRequirements = { count: -1 };
    }

    pipeline.push({ $sort: sortRequirements });

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
        const today = setToMidnight(new Date());
        const loanRecords = await GetBookLoaned({status: 'Loaned', dueDate: { $lt: today }, finesPaid: { $ne: 'Not Paid' }}) as BookLoanedInterface[];
        
        const expiresLoanRecords = loanRecords.filter( bookLoaned => 
            {
                const dueDate = setToMidnight(new Date(bookLoaned.dueDate));
                return today > dueDate && bookLoaned.finesPaid !== "Not Paid";
            }
        )

        if (expiresLoanRecords.length === 0) 
        {
            console.log("No new expired records detected today");
            return;
        }

        console.log(`Processing ${expiresLoanRecords.length} newly expired records...`);

        for(const expiredRecord of expiresLoanRecords)
        {
            const updateRecord = await FindBookLoanedByIDAndUpdate(expiredRecord._id as unknown as string, {finesPaid: 'Not Paid', fineAmount: 1.5});

            if(!updateRecord)
            {
                console.log(`Record ${expiredRecord._id} update failed!`)
            }

            console.log(`Record ${expiredRecord._id} initialised ($1.5)`);
        }
    }
    catch(error)
    {
        console.error("Error modifying fine amounts:", error);
    }
}

export const modifyFinesAmount = async() => 
{
    try
    {
        const expiresLoanRecords = await GetBookLoaned({finesPaid: 'Not Paid'}) as BookLoanedInterface[];

        console.log(`Totally has ${expiresLoanRecords.length} loan records does not paid the fines`);
        if(expiresLoanRecords.length === 0) return;

        for(const bookLoaned of expiresLoanRecords)
        {
            /*
                Date-only comparison(Ignore the hr/seconds, only compare the date)
                e.g. dueDate = 24/12/2025 -> Union to 24/12/2025 00:00:00
                       today = 25/12/2025 -> Union to 25/12/2025 00:00:00
                       Result: 25 - 24 = 1 (the expireDay)
            */
            const dueDate = setToMidnight(new Date(bookLoaned.dueDate as Date));
            const today = setToMidnight(new Date())

            // Calculate the timeDiff after transfer to date only
            const diffTime = today.getTime() - dueDate.getTime();
            const expireDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

            // Calculate the final amount (based on the expiresDays)
            const finalAmount = Math.min(expireDays * 1.5, 130);

            if(bookLoaned.fineAmount !== finalAmount)
            {
                const updateRecord = await FindBookLoanedByIDAndUpdate(bookLoaned._id as unknown as string, {fineAmount: finalAmount});
                if(!updateRecord)
                {
                    console.log(`Failed to modify ${bookLoaned._id} loan record finesAmount!`);
                    continue;
                }
            }
            console.log(`Loan Record ${bookLoaned._id} fine Amount ($${finalAmount}) modify successfully!`);
        }
        
    }
    catch(error)
    {
        console.error("Error detecting expired loan records:", error);
    }
}