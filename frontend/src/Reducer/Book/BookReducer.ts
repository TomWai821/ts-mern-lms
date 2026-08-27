import { BookDataInterface } from "../../Model/ResultModel";

export type BookAction =
    | { type: "SET_ALL_BOOK"; payload: BookDataInterface[] }
    | { type: "CREATE_BOOK"; payload: BookDataInterface }
    | { type: "UPDATE_BOOK"; payload: BookDataInterface }
    | { type: "DELETE_BOOK"; payload: string }
    
export const BookReducer = (state: BookDataInterface[], action: BookAction) => 
{
    switch (action.type) 
    {
        case "SET_ALL_BOOK": 
            return action.payload;

        case "CREATE_BOOK": 
            return [...state, action.payload];

        case "UPDATE_BOOK":
            return state.map(book => book._id === action.payload._id ? action.payload : book);

        case "DELETE_BOOK": 
            return state.filter(book => book._id !== action.payload);

        default: 
            return state;
    }
};