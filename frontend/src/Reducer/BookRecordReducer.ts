import { useReducer } from "react";
import { BookDataInterface, LoanBookInterface } from "../Model/ResultModel";

import { BookAction, BookReducer } from "./Book/BookReducer";
import { LoanBookAction, LoanBookReducer } from "./Book/LoanBookReducer";

export interface BookState 
{
    AllBook: BookDataInterface[];
    OnLoanBook: LoanBookInterface[];
}

const initialState: BookState = 
{
    AllBook: [],
    OnLoanBook: [],
};

const bookRecordReducer = (state: BookState, action: BookAction | LoanBookAction) => 
(
    {
        AllBook: BookReducer(state.AllBook, action as BookAction),
        OnLoanBook: LoanBookReducer(state.OnLoanBook, action as LoanBookAction)
    }
);

export const useBookReduer = () => 
{
    const [state, dispatch] = useReducer(bookRecordReducer, initialState);
    return {state, dispatch};
}