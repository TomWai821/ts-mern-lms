import { createContext, FC, useCallback, useContext, useEffect } from "react";

import { BookContextProps, ChildProps } from "../../Model/ContextAndProviderModel";

import { CalculateDueDate, GetCurrentDate } from "../../Controller/OtherController";
import { GetResultInterface } from "../../Model/ResultModel";
import { fetchBook, fetchLoanBook, GetExternalData } from "../../Controller/BookController/BookGetController";
import { createBookRecord, createLoanBookRecord, IBookCreationData } from "../../Controller/BookController/BookPostController";
import { IBookUpdateData, returnBookAndChangeStatus, updateBookRecord } from "../../Controller/BookController/BookPutController";
import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";

import { useAuthContext } from "../User/AuthContext";
import { useRecommendBookContext } from "./RecommendBookContext";
import { useBookReduer } from "../../Reducer/BookRecordReducer";
import { useWebSocket } from "../../customhook/WebSocket";
import { BookRecordwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { executeMutationWithFallback } from "../../Controller/MutationWithFallback";

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider:FC<ChildProps> = ({children}) => 
{
    const { GetData } = useAuthContext();
    const { fetchNewPublishBook, fetchMostPopularBook } = useRecommendBookContext();

    const {state, dispatch} = useBookReduer();
    const bookData = [state.AllBook, state.OnLoanBook];
    
    const authToken = GetData("authToken") as string;

    useWebSocket(dispatch, BookRecordwsEventToActionMap);

    const fetchAllBook = useCallback(async () => 
    {
        const resultForAllBook: GetResultInterface | undefined = await fetchBook("All");
        const resultForLoanBook: GetResultInterface | undefined = await fetchLoanBook(authToken, "AllUser");
        
        if(resultForAllBook && Array.isArray(resultForAllBook.foundBook))
        {
            dispatch({ type: "SET_ALL_BOOK", payload: resultForAllBook.foundBook });
        }

        if(resultForLoanBook && Array.isArray(resultForLoanBook.foundLoanBook))
        {
            dispatch({ type: "SET_LOAN_BOOK", payload: resultForLoanBook.foundLoanBook });
        }
    }
    ,[authToken, dispatch])

    const fetchBookWithFliterData = useCallback(async (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
    {
        const result = await fetchBook(bookname as string, status as string, genreID as string, languageID as string, authorID as string, publisherID as string);
        
        if(result && Array.isArray(result.foundBook))
        {
            dispatch({ type: "SET_ALL_BOOK", payload: result.foundBook });
        }
    }
    ,[dispatch])

    const fetchLoanBookWithFliterData = useCallback(async (type:string, bookname?:string, username?:string, status?:string, finesPaid?:string) => 
    {
        const result = await fetchLoanBook(authToken, type, bookname, username, status, finesPaid);

        if(result && Array.isArray(result.foundLoanBook))
        {
            dispatch({ type: "SET_LOAN_BOOK", payload: result.foundLoanBook });
        }
    }
    ,[authToken, dispatch])

    const fetchAllRecord = useCallback(async () => 
    {
        const task = [fetchAllBook(), fetchNewPublishBook(), fetchMostPopularBook()];
        await Promise.allSettled(task);
    }
    ,[fetchAllBook, fetchNewPublishBook, fetchMostPopularBook])

    const createBook = useCallback(async (bookCreationData: IBookCreationData) => 
    {
        return executeMutationWithFallback(() => 
            createBookRecord(authToken, bookCreationData), 
        fetchAllBook
        );
    }
    ,[authToken, fetchAllBook])

    const editBook = useCallback(async (bookID:string, bookUpdateData: IBookUpdateData) => 
    {
        return executeMutationWithFallback(() => 
            updateBookRecord(authToken, bookID, bookUpdateData), 
            fetchAllBook
        );
    }
    ,[authToken, fetchAllBook])

    const loanBook = useCallback(async(bookID:string, userID?:string) => 
    {
        const loanDate = GetCurrentDate("Date") as Date
        const dueDate = CalculateDueDate(7);

        return executeMutationWithFallback(() => createLoanBookRecord(authToken, bookID, loanDate, dueDate, userID), fetchAllBook);
    }
    ,[authToken, fetchAllBook])

    const returnBook = useCallback(async(loanRecordID:string, finesPaid?:string) =>
    {
        return executeMutationWithFallback(() => returnBookAndChangeStatus(authToken, loanRecordID, finesPaid), fetchAllBook);
    }
    ,[authToken, fetchAllBook])

    const deleteBook = useCallback((bookID:string) => 
    {
        return executeMutationWithFallback(() => deleteBookRecord("Book", authToken, bookID), fetchAllBook);
    }
    ,[authToken, fetchAllBook])

    const getExternalData = useCallback(async(bookname:string, author:string) => 
    {
        const result = await GetExternalData(authToken, bookname, author);
        return result;
    },[authToken])

    useEffect(() => 
    {
        fetchAllBook();
    },[fetchAllBook])

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
