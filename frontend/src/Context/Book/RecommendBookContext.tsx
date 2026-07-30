import { createContext, FC, useCallback, useContext, useEffect, useReducer } from "react";

import { ChildProps, RecommendBookContextProps } from "../../Model/ContextAndProviderModel";
import { BookDataInterface, GetResultInterface, LoanBookInterface } from "../../Model/ResultModel";

import { fetchSuggestBook } from "../../Controller/BookController/RecommendBookController";

import { useSelfBookRecordContext } from "./SelfBookRecordContext";

interface RecommendationBookState 
{
    newPublishBook: BookDataInterface[];
    mostPopularBook: LoanBookInterface[];
}

type RecommendationBookAction =
    | { type: "SET_NEW_PUBLISH_BOOK"; payload: BookDataInterface[] }
    | { type: "SET_MOST_POPULAR_BOOK"; payload: LoanBookInterface[] };

const initialState: RecommendationBookState = 
{
    newPublishBook: [],
    mostPopularBook: [],
};

const recommendationBookReducer = (state: RecommendationBookState, action: RecommendationBookAction): RecommendationBookState => 
{
    switch (action.type) 
    {
        case "SET_NEW_PUBLISH_BOOK":
            return { ...state, newPublishBook: action.payload };

        case "SET_MOST_POPULAR_BOOK":
            return { ...state, mostPopularBook: action.payload };

        default:
            return state;
    }
};

const RecommendBookContext = createContext<RecommendBookContextProps | undefined>(undefined);

export const RecommendBookProvider:FC<ChildProps> = ({children}) => 
{
    const {bookForUser} = useSelfBookRecordContext();

    const [state, dispatch] = useReducer(recommendationBookReducer, initialState);
    const suggestBook = [bookForUser, state.newPublishBook, state.mostPopularBook];


    const fetchNewPublishBook = useCallback(async () => 
    {
        const resultForNewPublishBook: GetResultInterface | undefined = await fetchSuggestBook("newPublish");
        
        if (resultForNewPublishBook && Array.isArray(resultForNewPublishBook.foundBook))
        {
            dispatch({ type: "SET_NEW_PUBLISH_BOOK", payload: resultForNewPublishBook.foundBook });
        }
    },[])

    const fetchMostPopularBook = useCallback(async() => 
    {
        const resultForMostPopularBook: GetResultInterface | undefined = await fetchSuggestBook("mostPopular");

        if (resultForMostPopularBook && Array.isArray(resultForMostPopularBook.foundBook)) 
        {
            dispatch({ type: "SET_MOST_POPULAR_BOOK", payload: resultForMostPopularBook.foundBook });
        }
    },[])

    const fetchRecommendBook = useCallback(async () =>
    {
        const task = [fetchNewPublishBook(), fetchMostPopularBook()];
        await Promise.allSettled(task);
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