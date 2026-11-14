import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";
import { IBookCreationData, createBookRecord, createLoanBookRecord } from "../../Controller/BookController/BookPostController";
import { IBookUpdateData, updateBookRecord, returnBookAndChangeStatus } from "../../Controller/BookController/BookPutController";
import { GetCurrentDate, CalculateDueDate } from "../../Controller/OtherController";
import { fetchBook, fetchLoanBook, GetExternalData } from "../../Controller/BookController/BookGetController";

export async function createBook(bookCreationData: IBookCreationData)
{
    return createBookRecord(bookCreationData);
}


export async function editBook(bookID:string, bookUpdateData: IBookUpdateData)
{
    return updateBookRecord(bookID, bookUpdateData);
}


export async function loanBook(bookID:string, userID?:string)
{
    const loanDate = GetCurrentDate("Date") as Date
    const dueDate = CalculateDueDate(7);

    return createLoanBookRecord(bookID, loanDate, dueDate, userID);
}


export async function returnBook(loanRecordID:string, finesPaid?:string)
{
    return returnBookAndChangeStatus(loanRecordID, finesPaid);
}


export async function deleteBook(bookID:string)
{
    return deleteBookRecord("Book", bookID);
}

// For Data Fetching
export async function fetchAllBooks()
{
    const result = await fetchBook();

    if(result && Array.isArray(result.foundBook))
    {
        return result.foundBook;
    }
}


export async function fetchAllLoanBook(isAdmin: boolean)
{
    if(!isAdmin)
    {
        return [];
    }

    const result = await fetchLoanBook("AllUser");

    if(result && Array.isArray(result.foundLoanBook))
    {
        return result.foundLoanBook;
    }
}


export async function fetchBookWithFliterData(bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string)
{
    const result = await fetchBook(bookname as string, status as string, genreID as string, languageID as string, authorID as string, publisherID as string);

    if(result && Array.isArray(result.foundBook))
    {
        return result.foundBook;
    }
}


export async function fetchLoanBookWithFliterData(type:string, bookname?:string, username?:string, status?:string, finesPaid?:string)
{
    const result = await fetchLoanBook(type, bookname, username, status, finesPaid);

    if(result && Array.isArray(result.foundLoanBook))
    {
        return result.foundLoanBook;
    }
}


export async function getExternalData(bookname:string, author:string)
{
    const result = await GetExternalData(bookname, author);
    return result;
}