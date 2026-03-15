import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { ChildProps, SelfBookRecordContextProps } from "../../Model/ContextAndProviderModel";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";
import { fetchFavouriteBook, fetchLoanBook, fetchSuggestBook } from "../../Controller/BookController/BookGetController";
import { createFavouriteBookRecord } from "../../Controller/BookController/BookPostController";
import { useAuthContext } from "../User/AuthContext";
import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";

const SelfBookRecordContext = createContext<SelfBookRecordContextProps | undefined>(undefined);

export const SelfBookRecordProvider:FC<ChildProps> = ({children}) => 
{
    const {GetData} = useAuthContext();

    const [SelfLoanBook, setSelfLoanBook] = useState<LoanBookInterface[]>([]);
    const [FavouriteBook, setFavouriteBook] = useState<LoanBookInterface[]>([]);
    const [bookForUser, setBookForUser] = useState<BookDataInterface[]>([]);
    const BookRecordForUser = [SelfLoanBook, FavouriteBook];

    const authToken = GetData("authToken") as string;

    const fetchFavouriteRecord = useCallback(async() => 
    {
        const resultForFavouriteBook: GetResultInterface | undefined = await fetchFavouriteBook(authToken);
    
        if (resultForFavouriteBook && Array.isArray(resultForFavouriteBook.foundFavouriteBook)) 
        {
            setFavouriteBook(resultForFavouriteBook.foundFavouriteBook);
        }
    },[authToken])

    const fetchSelfLoanRecord = useCallback(async() =>
    {
        const resultForSelfLoanBook: GetResultInterface | undefined = await fetchLoanBook(authToken, "Self");
    
        if (resultForSelfLoanBook && Array.isArray(resultForSelfLoanBook.foundLoanBook)) 
        {
            setSelfLoanBook(resultForSelfLoanBook.foundLoanBook);
        }
    },[authToken])

    const fetchRecommendBookForUser = useCallback(async () => 
    {
        const resultForUser = await fetchSuggestBook("forUser", authToken);

        if (resultForUser && Array.isArray(resultForUser.foundBook)) 
        {
            setBookForUser(resultForUser.foundBook);
        }
    }, [authToken]);

    const fetchSelfFavouriteBookWithFilterData = useCallback(async(bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
    {
        const result = await fetchFavouriteBook(authToken, bookname, status, genreID, languageID, authorID, publisherID);

        if(result && Array.isArray(result.foundFavouriteBook))
        {
            setFavouriteBook(result.foundFavouriteBook);
        }
    },[authToken])

    const fetchSelfLoanBookWithFilterData = useCallback(async(type:string, bookname?:string, status?:string) => 
    {
        const result = await fetchLoanBook(authToken, type, bookname, undefined, status);
        
        if(result && Array.isArray(result.foundLoanBook))
        {
            setSelfLoanBook(result.foundLoanBook);
        }
    },[authToken])

    const fetchSelfRecord = useCallback(async () => 
    {
        fetchFavouriteRecord();
        fetchSelfLoanRecord();
    },[fetchFavouriteRecord, fetchSelfLoanRecord])

    const favouriteBook = useCallback(async(bookID:string) => 
    {
        const result: Response = await createFavouriteBookRecord(authToken, bookID);

        if(result)
        {
            fetchSelfRecord();
        }
        return result;
    },[authToken, fetchSelfRecord])

    const unfavouriteBook = useCallback(async(FavouriteBookID:string) => 
    {
        const result: Response = await deleteBookRecord("Favourite", authToken, FavouriteBookID);

        if(result)
        {
            fetchSelfRecord();
        }
        return result;

    },[authToken, fetchSelfRecord])

    const allRecordTask = useCallback(async () => 
    {
        if(!authToken) return;

        const task = [fetchFavouriteRecord(), fetchSelfLoanRecord(), fetchRecommendBookForUser()];
        await Promise.allSettled(task);
        
    },[authToken, fetchFavouriteRecord, fetchSelfLoanRecord, fetchRecommendBookForUser])

    useEffect(() => 
    {
        if(authToken)
        {
            allRecordTask();
        }
    },[allRecordTask])

    return (
        <SelfBookRecordContext.Provider value={{ BookRecordForUser, bookForUser, fetchFavouriteRecord, fetchSelfLoanRecord, fetchSelfFavouriteBookWithFilterData, fetchSelfLoanBookWithFilterData, favouriteBook, unfavouriteBook }}>
            {children}
        </SelfBookRecordContext.Provider>
    );
}

export const useSelfBookRecordContext = () => 
{
    const context = useContext(SelfBookRecordContext);
    
    if (context === undefined) 
    {
        throw new Error("useSelfBookRecordContext must be used within a SelfBookRecordProvider");
    }
    return context;
};