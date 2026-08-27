import { UserResultDataInterface } from "../../Model/ResultModel";

export type UserAction =
  | { type: "SET_ALL_USER"; payload: UserResultDataInterface[] }
  | { type: "CREATE_USER"; payload: UserResultDataInterface }
  | { type: "UPDATE_USER"; payload: UserResultDataInterface }
  | { type: "DELETE_USER"; payload: string };

export const userReducer = (state: UserResultDataInterface[], action: UserAction) => 
{
    switch (action.type) 
    {
        case "SET_ALL_USER": 
            return action.payload;

        case "CREATE_USER": 
            return [...state, action.payload];

        case "UPDATE_USER":
            return state.map(user => user._id === action.payload._id ? action.payload : user);

        case "DELETE_USER": 
            return state.filter(user => user._id !== action.payload);

        default: 
            return state;
    }
};