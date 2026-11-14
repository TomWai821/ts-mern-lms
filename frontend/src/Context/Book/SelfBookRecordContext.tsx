import { createContext, FC, useContext, useEffect, useReducer } from "react";

import { ChildProps } from "../../Model/ContextAndProviderModel";
import { LoanBookInterface } from "../../Model/ResultModel";
import { fetchSelfFavouriteRecord, fetchSelfLoanRecord } from "../../services/contents/selfRecordService";

interface SelfBookRecordState 
{
    SelfLoanBook: LoanBookInterface[];
    FavouriteBook: LoanBookInterface[];
}

type SelfBookRecordAction =
    | { type: "SET_SELF_LOAN_BOOK"; payload: LoanBookInterface[] }
    | { type: "SET_FAVOURITE_BOOK"; payload: LoanBookInterface[] }
    

const initialState: SelfBookRecordState = 
{
    SelfLoanBook: [],
    FavouriteBook: [],
};

const selfBookRecordReducer = (state: SelfBookRecordState, action: SelfBookRecordAction): SelfBookRecordState => 
{
    switch (action.type) 
    {
        case "SET_SELF_LOAN_BOOK":
            return { ...state, SelfLoanBook: action.payload};

        case "SET_FAVOURITE_BOOK":
            return { ...state, FavouriteBook: action.payload};

        default:
            return state;
    }
};

interface SelfBookRecordContextProps
{
    BookRecordForUser: LoanBookInterface[][];
    initSelfRecords: () => Promise<void>;
    refreshSelfRecords: (type: string) => Promise<void>;
    modifySelfRecords: (action: SelfBookRecordAction) => void;
}

const SelfBookRecordContext = createContext<SelfBookRecordContextProps | undefined>(undefined);

export const SelfBookRecordProvider:FC<ChildProps> = ({children}) => 
{
    const [ state, dispatch ] = useReducer(selfBookRecordReducer, initialState);
    const { SelfLoanBook, FavouriteBook } = state;
    const BookRecordForUser = [SelfLoanBook, FavouriteBook];

    const initSelfRecords = async () => 
    {
        const [loanBooks, favouriteBooks] = await Promise.allSettled([fetchSelfLoanRecord(), fetchSelfFavouriteRecord()]);

        const loanBooksResult: LoanBookInterface[] | undefined = loanBooks.status === 'fulfilled' ? loanBooks.value : undefined; 
        const favouriteBooksResult: LoanBookInterface[] | undefined = favouriteBooks.status === 'fulfilled' ? favouriteBooks.value : undefined;
        
        if(loanBooksResult && Array.isArray(loanBooksResult))
        {
            dispatch({ type: "SET_SELF_LOAN_BOOK", payload: loanBooksResult });
        }

        if(favouriteBooksResult && Array.isArray(favouriteBooksResult))
        {
            dispatch({ type: "SET_FAVOURITE_BOOK", payload: favouriteBooksResult });
        }
    }

    const refreshSelfRecords = async (type:string) =>
    {
        switch(type)
        {
            case "LoanBook":
                const loanBooksResult = await fetchSelfLoanRecord() as LoanBookInterface[];
                dispatch({ type: "SET_SELF_LOAN_BOOK", payload: loanBooksResult });
                break;

            case "FavouriteBook": 
                const favouriteBooksResult = await fetchSelfFavouriteRecord() as LoanBookInterface[];
                dispatch({ type: "SET_FAVOURITE_BOOK", payload: favouriteBooksResult });
                break;
        }
    };

    const modifySelfRecords = (action: SelfBookRecordAction) => 
    {
        dispatch(action);
    }

    useEffect(() => 
    {
        initSelfRecords();
    },[])

    return (
        <SelfBookRecordContext.Provider value={{ BookRecordForUser, initSelfRecords, refreshSelfRecords, modifySelfRecords }}>
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