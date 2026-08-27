import { ContactInterface } from "../../Model/ResultModel";

export type AuthorAction =
  | { type: "SET_AUTHOR"; payload: ContactInterface[] }
  | { type: "CREATE_AUTHOR"; payload: ContactInterface }
  | { type: "UPDATE_AUTHOR"; payload: ContactInterface }
  | { type: "DELETE_AUTHOR"; payload: string };

export const authorReducer = (state: ContactInterface[], action: AuthorAction) => 
{
    switch (action.type) 
    {
        case "SET_AUTHOR": 
            return action.payload;

        case "CREATE_AUTHOR": 
            return [...state, action.payload];

        case "UPDATE_AUTHOR":
            return state.map(a => a._id === action.payload._id ? action.payload : a);

        case "DELETE_AUTHOR": 
            return state.filter(a => a._id !== action.payload);

        default: 
            return state;
    }
};
