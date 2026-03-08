import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { ChildProps, RecommendBookContextProps } from "../../Model/ContextAndProviderModel";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";
import { fetchSuggestBook } from "../../Controller/BookController/BookGetController";
import { useSelfBookRecordContext } from "./SelfBookRecordContext";

const RecommendBookContext = createContext<RecommendBookContextProps | undefined>(undefined);

export const RecommendBookProvider:FC<ChildProps> = ({children}) => 
{
    const {bookForUser} = useSelfBookRecordContext();

    const [newPublishBook, setNewPublishBook] = useState<BookDataInterface[]>([]);
    const [mostPopularBook, setMostPopularBook] = useState<LoanBookInterface[]>([]);
    const suggestBook = [bookForUser, newPublishBook, mostPopularBook];


    const fetchNewPublishBook = useCallback(async () => 
    {
        const resultForNewPublishBook: GetResultInterface | undefined = await fetchSuggestBook("newPublish");
        
        if (resultForNewPublishBook && Array.isArray(resultForNewPublishBook.foundBook))
        {
            setNewPublishBook(resultForNewPublishBook.foundBook);
        }
    },[])

    const fetchMostPopularBook = useCallback(async() => 
    {
        const resultForMostPopularBook: GetResultInterface | undefined = await fetchSuggestBook("mostPopular");

        if (resultForMostPopularBook && Array.isArray(resultForMostPopularBook.foundLoanBook)) 
        {
            setMostPopularBook(resultForMostPopularBook.foundLoanBook);
        }
    },[])

    const fetchRecommendBook = useCallback(async () =>
    {
        fetchNewPublishBook();
        fetchMostPopularBook();
    },[fetchNewPublishBook, fetchMostPopularBook])

    useEffect(() =>
    {
        fetchRecommendBook();
    },[fetchRecommendBook])

    return(
        <RecommendBookContext.Provider value={{ suggestBook, fetchRecommendBook, fetchNewPublishBook, fetchMostPopularBook}}>
            {children}
        </RecommendBookContext.Provider>
    )
}

export const useRecommendBookContext = () => 
{
    const context = useContext(RecommendBookContext);
    
    if (context === undefined) 
    {
        throw new Error("useRecommendBookContext must be used within a RecommendBookProvider");
    }
    return context;
};