import { createContext, FC, useCallback, useContext, useEffect, useReducer } from "react";

import { ChildProps, SelfBookRecordContextProps } from "../../Model/ContextAndProviderModel";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";

import { fetchFavouriteBook, fetchLoanBook } from "../../Controller/BookController/BookGetController";
import { fetchSuggestBook } from "../../Controller/BookController/RecommendBookController";
import { createFavouriteBookRecord } from "../../Controller/BookController/BookPostController";
import { deleteBookRecord } from "../../Controller/BookController/BookDeleteController";

import { useAuthContext } from "../User/AuthContext";

interface SelfBookRecordState 
{
    SelfLoanBook: LoanBookInterface[];
    FavouriteBook: LoanBookInterface[];
    bookForUser: BookDataInterface[];
}

type SelfBookRecordAction =
    | { type: "SET_FAVOURITE_BOOK"; payload: LoanBookInterface[] }
    | { type: "SET_SELF_LOAN_BOOK"; payload: LoanBookInterface[] }
    | { type: "SET_BOOK_FOR_USER"; payload: BookDataInterface[] };

const initialState: SelfBookRecordState = 
{
    SelfLoanBook: [],
    FavouriteBook: [],
    bookForUser: [],
};

const selfBookRecordReducer = (state: SelfBookRecordState, action: SelfBookRecordAction): SelfBookRecordState => 
{
    switch (action.type) 
    {
        case "SET_FAVOURITE_BOOK":
            return { ...state, FavouriteBook: action.payload };

        case "SET_SELF_LOAN_BOOK":
            return { ...state, SelfLoanBook: action.payload };

        case "SET_BOOK_FOR_USER":
            return { ...state, bookForUser: action.payload };

        default:
            return state;
    }
};

const SelfBookRecordContext = createContext<SelfBookRecordContextProps | undefined>(undefined);

export const SelfBookRecordProvider:FC<ChildProps> = ({children}) => 
{
    const {GetData} = useAuthContext();

    const [state, dispatch] = useReducer(selfBookRecordReducer, initialState);
    const { SelfLoanBook, FavouriteBook, bookForUser } = state;
    const BookRecordForUser = [SelfLoanBook, FavouriteBook];

    const authToken = GetData("authToken") as string;

    const fetchFavouriteRecord = useCallback(async() => 
    {
        const resultForFavouriteBook: GetResultInterface | undefined = await fetchFavouriteBook(authToken);
    
        if (resultForFavouriteBook && Array.isArray(resultForFavouriteBook.foundFavouriteBook)) 
        {
            dispatch({ type: "SET_FAVOURITE_BOOK", payload: resultForFavouriteBook.foundFavouriteBook });
        }
    },[authToken])

    const fetchSelfLoanRecord = useCallback(async() =>
    {
        const resultForSelfLoanBook: GetResultInterface | undefined = await fetchLoanBook(authToken, "Self");
    
        if (resultForSelfLoanBook && Array.isArray(resultForSelfLoanBook.foundLoanBook)) 
        {
            dispatch({ type: "SET_SELF_LOAN_BOOK", payload: resultForSelfLoanBook.foundLoanBook });
        }
    },[authToken])

    const fetchRecommendBookForUser = useCallback(async () => 
    {
        const resultForUser = await fetchSuggestBook("forUser", authToken);

        if (resultForUser && Array.isArray(resultForUser.foundBook)) 
        {
            dispatch({ type: "SET_BOOK_FOR_USER", payload: resultForUser.foundBook });
        }
    }, [authToken]);

    const fetchSelfFavouriteBookWithFilterData = useCallback(async(bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
    {
        const result = await fetchFavouriteBook(authToken, bookname, status, genreID, languageID, authorID, publisherID);

        if(result && Array.isArray(result.foundFavouriteBook))
        {
            dispatch({ type: "SET_FAVOURITE_BOOK", payload: result.foundFavouriteBook });
        }
    },[authToken])

    const fetchSelfLoanBookWithFilterData = useCallback(async(type:string, bookname?:string, status?:string) => 
    {
        const result = await fetchLoanBook(authToken, type, bookname, undefined, status);
        
        if(result && Array.isArray(result.foundLoanBook))
        {
            dispatch({ type: "SET_SELF_LOAN_BOOK", payload: result.foundLoanBook });
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
        if(!authToken)
        {
            return;
        }

        const task = [fetchFavouriteRecord(), fetchSelfLoanRecord(), fetchRecommendBookForUser()];
        await Promise.allSettled(task);

    },[authToken, fetchFavouriteRecord, fetchSelfLoanRecord, fetchRecommendBookForUser])

    useEffect(() => 
    {
        if(authToken)
        {
            allRecordTask();
        }
    },[authToken, allRecordTask])

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