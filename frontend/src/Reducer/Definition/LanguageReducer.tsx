import { DefinitionInterface } from "../../Model/ResultModel";

export type LanguageAction =
  | { type: "SET_LANGUAGE"; payload: DefinitionInterface[] }
  | { type: "CREATE_LANGUAGE"; payload: DefinitionInterface }
  | { type: "UPDATE_LANGUAGE"; payload: DefinitionInterface }
  | { type: "DELETE_LANGUAGE"; payload: string };

export const languageReducer = (state: DefinitionInterface[], action: LanguageAction) => 
{
    switch (action.type) 
    {
        case "SET_LANGUAGE": 
            return action.payload;

        case "CREATE_LANGUAGE": 
            return [...state, action.payload];

        case "UPDATE_LANGUAGE":
            return state.map(l => l._id === action.payload._id ? action.payload : l);

        case "DELETE_LANGUAGE": 
            return state.filter(l => l._id !== action.payload);

        default: 
            return state;
    }
};