import { LoanBookInterface } from "../Model/ResultModel";

interface SelfBookRecordState 
{
    SelfLoanBook: LoanBookInterface[];
    FavouriteBook: LoanBookInterface[];
}

export type SelfBookRecordAction =
    | { type: "SET_SELF_LOAN_BOOK"; payload: LoanBookInterface[] }
    | { type: "SET_FAVOURITE_BOOK"; payload: LoanBookInterface[] }
    | { type: "ADD_FAVOURITE_BOOK"; payload: LoanBookInterface }
    | { type: "REMOVE_FAVOURITED_BOOK"; payload: string }
    

export const initialState: SelfBookRecordState = 
{
    SelfLoanBook: [],
    FavouriteBook: [],
};

export const selfBookRecordReducer = (state: SelfBookRecordState, action: SelfBookRecordAction): SelfBookRecordState => 
{
    switch (action.type) 
    {
        case "SET_SELF_LOAN_BOOK":
            return { ...state, SelfLoanBook: action.payload};

        case "SET_FAVOURITE_BOOK":
            return { ...state, FavouriteBook: action.payload};

        case "ADD_FAVOURITE_BOOK":
            return {...state, FavouriteBook: [...state.FavouriteBook, action.payload]};

        case "REMOVE_FAVOURITED_BOOK":
            return {...state, FavouriteBook: state.FavouriteBook.filter(favouriteBook => favouriteBook._id !== action.payload)} 

        default:
            return state;
    }
};