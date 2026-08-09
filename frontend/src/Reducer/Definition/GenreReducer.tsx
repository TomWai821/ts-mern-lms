import { DefinitionInterface } from "../../Model/ResultModel";

export type GenreAction =
  | { type: "SET_GENRE"; payload: DefinitionInterface[] }
  | { type: "CREATE_GENRE"; payload: DefinitionInterface }
  | { type: "UPDATE_GENRE"; payload: DefinitionInterface }
  | { type: "DELETE_GENRE"; payload: string };

export const genreReducer = (state: DefinitionInterface[], action: GenreAction) => 
{
    switch (action.type) 
    {
        case "SET_GENRE": 
            return action.payload;

        case "CREATE_GENRE": 
            return [...state, action.payload];

        case "UPDATE_GENRE":
            return state.map(g => g._id === action.payload._id ? action.payload : g);

        case "DELETE_GENRE": 
            return state.filter(g => g._id !== action.payload);

        default: 
            return state;
    }
};
