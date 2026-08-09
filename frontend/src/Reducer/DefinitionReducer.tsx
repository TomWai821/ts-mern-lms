import { useReducer } from "react";
import { DefinitionInterface } from "../Model/ResultModel";

import { genreReducer } from "./Definition/GenreReducer";
import { languageReducer } from "./Definition/LanguageReducer";

interface DefinitionState
{
    Genre: DefinitionInterface[];
    Language: DefinitionInterface[];
}


const initialState: DefinitionState =
{
    Genre:[],
    Language:[]
}

const definitionReducer = (state: DefinitionState, action: any) => 
(
    {
        Genre: genreReducer(state.Genre, action),
        Language: languageReducer(state.Language, action),
    }
);

export const useDefinitionReducer = () =>
{
    const [state, dispatch] = useReducer(definitionReducer, initialState);
    return { state, dispatch };
}