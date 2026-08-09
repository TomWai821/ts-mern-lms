import { BookEvent, broadcast } from "../../ws";
import { FindBookByIDAndUpdate, GetBook } from "../../schema/book/book";
import { GetBookLoaned, FindBookLoanedByIDAndUpdate } from "../../schema/book/bookLoaned";
import { BookInterface, BookLoanedInterface } from "../../model/bookSchemaInterface";

export const LoanBookRecordUpdateService = async (foundLoanedRecord: BookLoanedInterface, finesPaid: string) => 
{
    const currentDate = new Date();
    const dueDate = new Date(foundLoanedRecord.dueDate); 
    
    const status = dueDate && currentDate <= dueDate ? 'Returned' : 'Returned(Late)';

    const [changeLoanRecordStatus, changeBookState] = await Promise.all(
        [
            FindBookLoanedByIDAndUpdate(foundLoanedRecord._id as unknown as string, {status: status, returnDate: currentDate, finesPaid: finesPaid}),
            FindBookByIDAndUpdate(foundLoanedRecord.bookID as unknown as string, {status: 'OnShelf'})
        ]
    );

    if(!changeLoanRecordStatus)
    {
        return {success: false, statusCode: 400, error: "Failed to return Book"};
    }

    if(!changeBookState)
    {
        return {success: false, statusCode: 400, error: "Failed to change Book status!"};
    }

    const loanBookRecord = await GetBookLoaned({_id: foundLoanedRecord._id}) as BookLoanedInterface[];
    const bookRecord = await GetBook({_id: foundLoanedRecord.bookID}) as BookInterface[];

    broadcast(BookEvent.LOAN_BOOK_UPDATE, loanBookRecord[0]);
    broadcast(BookEvent.BOOK_UPDATE, bookRecord[0]);
    return {success: true, statusCode: 200, message: "Return Loan Book Successfully!"};
}