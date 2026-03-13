import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { BookContextProps, ChildProps } from "../../Model/ContextAndProviderModel";
import { CalculateDueDate, GetCurrentDate } from "../../Controller/OtherController";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";
import { fetchBook, fetchLoanBook, GetExternalData } from "../../Controller/BookController/BookGetController";
import { createBookRecord, createLoanBookRecord } from "../../Controller/BookController/BookPostController";
import { returnBookAndChangeStatus, updateBookRecord } from "../../Controller/BookController/BookPutController";
import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";
import { useAuthContext } from "../User/AuthContext";
import { useRecommendBookContext } from "./RecommendBookContext";

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider:FC<ChildProps> = ({children}) => 
{
    const { GetData } = useAuthContext();
    const { fetchNewPublishBook, fetchMostPopularBook } = useRecommendBookContext();
    
    const [AllBook, setAllBook] = useState<BookDataInterface[]>([]);
    const [OnLoanBook, setOnLoanBook] = useState<LoanBookInterface[]>([]);
    const bookData = [AllBook, OnLoanBook];
    
    const authToken = GetData("authToken") as string;

    const fetchAllBook = useCallback(async () => 
    {
        const resultForAllBook: GetResultInterface | undefined = await fetchBook("All");
        const resultForLoanBook: GetResultInterface | undefined = await fetchLoanBook(authToken, "AllUser");
        
        if(resultForAllBook && Array.isArray(resultForAllBook.foundBook))
        {
            setAllBook(resultForAllBook.foundBook);
        }

        if(resultForLoanBook && Array.isArray(resultForLoanBook.foundLoanBook))
        {
            setOnLoanBook(resultForLoanBook.foundLoanBook);
        }
    },[authToken])

    const fetchBookWithFliterData = useCallback(async (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
    {
        const result = await fetchBook(bookname as string, status as string, genreID as string, languageID as string, authorID as string, publisherID as string);
        
        if(result && Array.isArray(result.foundBook))
        {
            setAllBook(result.foundBook);
        }
    },[])

    const fetchLoanBookWithFliterData = useCallback(async (type:string, bookname?:string, username?:string, status?:string, finesPaid?:string) => 
    {
        const result = await fetchLoanBook(authToken, type, bookname, username, status, finesPaid);

        if(result && Array.isArray(result.foundLoanBook))
        {
            setOnLoanBook(result.foundLoanBook);
        }
    },[authToken])

    const createBook = useCallback(async (image:File, bookname:string, genreID:string, languageID:string, publisherID:string, authorID:string, description:string, publishDate:string) => 
    {
        const result: Response = await createBookRecord(authToken, image, bookname, genreID, languageID, publisherID, authorID, description, publishDate);

        if(result)
        {
            fetchAllBook();
        }
        return result;

    },[fetchAllBook, authToken])

    const editBook = useCallback(async (bookID:string, imageName:string, newFile:File, bookname:string, genreID:string, languageID:string, publisherID:string, publishDate:string, authorID:string, description:string) => 
    {
        const result: Response = await updateBookRecord(authToken, bookID, imageName, newFile, bookname, genreID, languageID, publisherID, publishDate, authorID, description);

        if(result)
        {
            fetchAllBook();
        }
        return result;
        
    },[fetchAllBook, authToken])

    const loanBook = useCallback(async(bookID:string, userID?:string) => 
    {
        const loanDate = GetCurrentDate("Date") as Date
        const dueDate = CalculateDueDate(7);
        const result: Response = await createLoanBookRecord(authToken, bookID, loanDate, dueDate, userID);

        if(result)
        {
            fetchAllBook();
        }
        return result;

    },[fetchAllBook, authToken])

    const returnBook = useCallback(async(loanRecordID:string, finesPaid?:string) =>
    {
        const result: Response = await returnBookAndChangeStatus(authToken, loanRecordID, finesPaid);

        if(result)
        {
            fetchAllBook();
        }
        return result;

    },[fetchAllBook, authToken])

    const deleteBook = useCallback(async (bookID:string) => 
    {
        const result: Response = await deleteBookRecord("Book", authToken, bookID);

        if(result)
        {
            fetchAllBook();
        }
        return result;

    },[fetchAllBook, authToken])

    const getExternalData = useCallback(async(bookname:string, author:string) => 
    {
        const result = await GetExternalData(authToken, bookname, author);
        return result;
        
    },[authToken])

    const fetchAllRecord = useCallback(async () => 
    {
        const task = [fetchAllBook(), fetchNewPublishBook(), fetchMostPopularBook()];
        await Promise.allSettled(task);
    },[fetchAllBook, fetchNewPublishBook, fetchMostPopularBook])

    useEffect(() => 
    {
        fetchAllRecord();
    },[fetchAllRecord])

    return (
        <BookContext.Provider value={{ bookData, fetchAllRecord, fetchAllBook, fetchBookWithFliterData, fetchLoanBookWithFliterData, createBook, editBook, loanBook, returnBook, deleteBook, getExternalData }}>
            {children}
        </BookContext.Provider>
    );
}
    
export const useBookContext = () => 
{
    const context = useContext(BookContext);
    
    if (context === undefined) 
    {
        throw new Error("useBookContext must be used within a BookProvider");
    }
    return context;
};
