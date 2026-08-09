import { jwtVerify } from "../../controller/hashing";
import { UserInterface } from "../../model/userSchemaInterface";
import { FindBookByIDAndUpdate, GetBook } from "../../schema/book/book";
import { CreateBookLoaned, GetBookLoaned } from "../../schema/book/bookLoaned";
import { FindUser } from "../../schema/user/user";
import { BookEvent, broadcast } from "../../ws";
import { BookInterface, BookLoanedInterface } from "../../model/bookSchemaInterface";

export const CreateLoanBookRecordService = async (userID: string, librarianUserID: string, bookID: string, loanDate: Date, dueDate: Date) => 
{
    let UserID;
            
    if (userID) 
    {
        const data = await jwtVerify(userID); 
        UserID = data.user?._id;
        const user = await FindUser({ _id: UserID }) as UserInterface;
        
        if(user.status === "Suspend")
        {
            return {success: false, statusCode: 401, error: "This user is suspended!"};
        }
    }
    else 
    {
        UserID = librarianUserID;
    }

    const [createLoanRecord, changeBookState] = await Promise.all(
        [CreateBookLoaned({userID:UserID, bookID, loanDate, dueDate}), FindBookByIDAndUpdate(bookID, {status: 'OnLoan'})]
    );

    if(!createLoanRecord)
    {
        return {success: false, statusCode: 400, error: "Failed to create Loaned Book Record"};
    }

    if(!changeBookState)
    {
        return {success: false, statusCode: 400, error: "Failed to change Book status"};
    }

    const loanRecord = await GetBookLoaned({_id: createLoanRecord._id}) as BookLoanedInterface[];
    const bookRecord = await GetBook({_id: changeBookState._id}) as BookInterface[];

    broadcast(BookEvent.LOAN_BOOK_CREATE, loanRecord[0]);
    broadcast(BookEvent.BOOK_UPDATE, bookRecord[0]);
    return {success: true, statusCode: 200, message: "Loaned Book Successfully!"};
}