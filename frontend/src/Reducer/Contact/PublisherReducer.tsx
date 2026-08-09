import { ContactInterface } from "../../Model/ResultModel";

export type PublisherAction =
  | { type: "SET_PUBLISHER"; payload: ContactInterface[] }
  | { type: "CREATE_PUBLISHER"; payload: ContactInterface }
  | { type: "UPDATE_PUBLISHER"; payload: ContactInterface }
  | { type: "DELETE_PUBLISHER"; payload: string };

export const publisherReducer = (state: ContactInterface[], action: PublisherAction) => 
{
    switch (action.type) 
    {
        case "SET_PUBLISHER": 
            return action.payload;

        case "CREATE_PUBLISHER": 
            return [...state, action.payload];

        case "UPDATE_PUBLISHER":
            return state.map(p => p._id === action.payload._id ? action.payload : p);

        case "DELETE_PUBLISHER": 
            return state.filter(p => p._id !== action.payload);

        default: 
            return state;
    }
};