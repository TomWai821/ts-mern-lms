import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { BookContextProps, ChildProps } from "../../Model/ContextAndProviderModel";
import { CalculateDueDate, GetCurrentDate } from "../../Controller/OtherController";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";
import { fetchBook, fetchLoanBook, GetExternalData } from "../../Controller/BookController/BookGetController";
import { createBookRecord, createLoanBookRecord } from "../../Controller/BookController/BookPostController";
import { returnBookAndChangeStatus, updateBookRecord } from "../../Controller/BookController/BookPutController";
import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";
import { useAuthContext } from "../User/AuthContext";
import { useSelfBookRecordContext } from "./SelfBookRecordContext";
import { useRecommendBookContext } from "./RecommendBookContext";

const BookContext = createContext<BookContextProps | undefined>(undefined);

export const BookProvider:FC<ChildProps> = ({children}) => 
{
    const { GetData } = useAuthContext();
    const { fetchFavouriteRecord, fetchSelfLoanRecord} = useSelfBookRecordContext();
    const { fetchNewPublishBook, fetchMostPopularBook } = useRecommendBookContext();
    
    const [AllBook, setAllBook] = useState<BookDataInterface[]>([]);
    const [OnLoanBook, setOnLoanBook] = useState<LoanBookInterface[]>([]);
    const bookData = [AllBook, OnLoanBook];
    
    const authToken = GetData("authToken") as string;

    const fetchAllRecord = useCallback(async () => 
    {
        fetchAllBook();
        fetchNewPublishBook();
        fetchMostPopularBook();

        if(authToken)
        {
            fetchFavouriteRecord();
            fetchSelfLoanRecord();
        }
    },[])

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
    },[])

    const fetchBookWithFliterData = useCallback(async (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
    {
        const result = await fetchBook(bookname as string, status as string, genreID as string, languageID as string, authorID as string, publisherID as string);
        
        if(result && Array.isArray(result.foundBook))
        {
            setAllBook(result.foundBook);
        }
    },[fetchAllBook])

    const fetchLoanBookWithFliterData = useCallback(async (type:string, bookname?:string, username?:string, status?:string, finesPaid?:string) => 
    {
        const result = await fetchLoanBook(authToken, type, bookname, username, status, finesPaid);

        if(result && Array.isArray(result.foundLoanBook))
        {
            setOnLoanBook(result.foundLoanBook);
        }
    },[fetchAllBook])

    const createBook = useCallback(async (image:File, bookname:string, genreID:string, languageID:string, publisherID:string, authorID:string, description:string, publishDate:string) => 
    {
        const result = await createBookRecord(authToken, image, bookname, genreID, languageID, publisherID, authorID, description, publishDate);

        if(result)
        {
            fetchAllBook();
            return true;
        }
        return false;

    },[fetchAllBook])

    const editBook = useCallback(async (bookID:string, imageName:string, newFile:File, bookname:string, genreID:string, languageID:string, publisherID:string, publishDate:string, authorID:string, description:string) => 
    {
        const result = await updateBookRecord(authToken, bookID, imageName, newFile, bookname, genreID, languageID, publisherID, publishDate, authorID, description);

        if(result)
        {
            fetchAllBook();
            return true;
        }
        return false;
        
    },[fetchAllBook])

    const loanBook = useCallback(async(bookID:string, userID?:string) => 
    {
        const loanDate = GetCurrentDate("Date") as Date
        const dueDate = CalculateDueDate(7);
        const result: Response = await createLoanBookRecord(authToken, bookID, loanDate, dueDate, userID);

        fetchAllBook();
        return result;

    },[fetchAllBook])

    const returnBook = useCallback(async(loanRecordID:string, finesPaid?:string) =>
    {
        const result = await returnBookAndChangeStatus(authToken, loanRecordID, finesPaid);

        if(result)
        {
            fetchAllBook();
            return true;
        }
        return false;

    },[fetchAllBook])

    const deleteBook = useCallback(async (bookID:string) => 
    {
        const result = await deleteBookRecord("Book", authToken, bookID);

        if(result)
        {
            fetchAllBook();
            return true;
        }
        return false;

    },[fetchAllBook])

    const getExternalData = useCallback(async(bookname:string, author:string) => 
    {
        const result = await GetExternalData(authToken, bookname, author);

        return result;
    },[])

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
