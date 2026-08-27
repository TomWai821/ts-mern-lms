import { useReducer } from "react";
import { BookDataInterface, LoanBookInterface } from "../Model/ResultModel";

import { BookReducer } from "./Book/BookReducer";
import { LoanBookReducer } from "./Book/LoanBookReducer";

interface BookState 
{
    AllBook: BookDataInterface[];
    OnLoanBook: LoanBookInterface[];
}

const initialState: BookState = 
{
    AllBook: [],
    OnLoanBook: [],
};

const bookRecordReducer = (state: BookState, action: any) => 
(
    {
        AllBook: BookReducer(state.AllBook, action),
        OnLoanBook: LoanBookReducer(state.OnLoanBook, action)
    }
);

export const useBookReduer = () => 
{
    const [state, dispatch] = useReducer(bookRecordReducer, initialState);
    return {state, dispatch};
}