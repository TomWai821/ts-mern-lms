import { LoanBookInterface } from "../../Model/ResultModel";

export type LoanBookAction =
    | { type: "SET_LOAN_BOOK"; payload: LoanBookInterface[] }
    | { type: "CREATE_LOAN_BOOK"; payload: LoanBookInterface }
    | { type: "UPDATE_LOAN_BOOK"; payload: LoanBookInterface }
    | { type: "DELETE_LOAN_BOOK"; payload: string }

export const LoanBookReducer = (state: LoanBookInterface[], action: LoanBookAction) => 
{
    switch (action.type) 
    {
        case "SET_LOAN_BOOK": 
            return action.payload;

        case "CREATE_LOAN_BOOK": 
            return [...state, action.payload];

        case "UPDATE_LOAN_BOOK":
            return state.map(loanBook => loanBook._id === action.payload._id ? action.payload : loanBook);

        case "DELETE_LOAN_BOOK": 
            return state.filter(loanBook => loanBook.bookDetails?._id !== action.payload);

        default: 
            return state;
    }
};
