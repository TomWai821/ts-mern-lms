import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";
import { fetchFavouriteBook, fetchLoanBook } from "../../Controller/BookController/BookGetController";
import { createFavouriteBookRecord } from "../../Controller/BookController/BookPostController";
import { GetResultInterface } from "../../Model/ResultModel";


export async function fetchSelfFavouriteRecord()
{
    const resultForFavouriteBook: GetResultInterface | undefined = await fetchFavouriteBook();

    if (resultForFavouriteBook && Array.isArray(resultForFavouriteBook.foundFavouriteBook)) 
    {
        return resultForFavouriteBook.foundFavouriteBook;
    }

    return [];
}


export async function fetchSelfLoanRecord()
{
    const resultForSelfLoanBook: GetResultInterface | undefined = await fetchLoanBook("Self");

    if (resultForSelfLoanBook && Array.isArray(resultForSelfLoanBook.foundLoanBook)) 
    {
        return resultForSelfLoanBook.foundLoanBook;
    }

    return [];
}

export async function favouriteBook(bookID:string)
{
    console.log(bookID);
    const result: Response = await createFavouriteBookRecord(bookID);
    return result;
}

export async function noLongerFavouriteBook(FavouriteBookID:string)
{
    console.log(FavouriteBookID);
    const result: Response = await deleteBookRecord("Favourite", FavouriteBookID);
    return result;
}

export const fetchFavouriteBookWithFilter= async(bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
{
    const result = await fetchFavouriteBook(bookname, status, genreID, languageID, authorID, publisherID);

    if(result && Array.isArray(result.foundFavouriteBook))
    {
        return result.foundFavouriteBook;
    }
}

export const fetchSelfLoanBookWithFilter = async(type:string, bookname?:string, status?:string) => 
{
    const result = await fetchLoanBook(type, bookname, undefined, status);
    
    if(result && Array.isArray(result.foundLoanBook))
    {
        return result.foundLoanBook;
    }
}