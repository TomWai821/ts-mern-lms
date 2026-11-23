import { createContext, FC, useCallback, useContext, useEffect } from "react";
import { ChildProps } from "../../Model/ContextAndProviderModel";

import { DefinitionInterface } from "../../Model/ResultModel";

import { useDefinitionReducer } from "../../Reducer/DefinitionReducer";
import { DefinitionwsEventToActionMap } from "../../services/ws/config/WSConfig";

import { fetchDefinitionData } from "../../services/contents/definitionService";
import { GenreAction } from "../../Reducer/Definition/GenreReducer";
import { LanguageAction } from "../../Reducer/Definition/LanguageReducer";
import { useWebSocket } from "../../hooks/customhook/WebSocket";

interface DefinatonProps
{
    definition: DefinitionInterface[][];
    initDefinitions: () => Promise<void>;
    refreshDefinitions: (type: string) => Promise<void>;
    modifyDefinitions: (action: GenreAction | LanguageAction) => void;
}

const DefinitionContext = createContext<DefinatonProps | undefined>(undefined);

export const DefinitionProvider:FC<ChildProps> = ({children}) => 
{
    const { state, dispatch } = useDefinitionReducer();   
    const definition = [state.Genre, state.Language];
    
    useWebSocket(dispatch, DefinitionwsEventToActionMap);

    const initDefinitions = useCallback(async () =>
    {
        const [genre, language] = await Promise.allSettled([fetchDefinitionData("Genre"), fetchDefinitionData("Language")]);

        const genreResult: DefinitionInterface[] | undefined = genre.status === 'fulfilled' ? genre.value : undefined; 
        const languageResult: DefinitionInterface[] | undefined = language.status === 'fulfilled' ? language.value : undefined;

        if(genreResult && Array.isArray(genreResult))
        {
            dispatch({ type: "SET_GENRE", payload: genreResult });
        }

        if(languageResult && Array.isArray(languageResult))
        {
            dispatch({ type: "SET_LANGUAGE", payload: languageResult });
        }
    }, [dispatch]);

    const refreshDefinitions = async (type: string) => 
    {
        const result = type === "Genre" ? await fetchDefinitionData("Genre") : await fetchDefinitionData("Language");
        const actionType = type === "Genre" ? "SET_GENRE" : "SET_LANGUAGE";

        dispatch({ type: actionType, payload: result });
    }

    const modifyDefinitions = (action: GenreAction | LanguageAction) => 
    {
        dispatch(action);
    }

    useEffect(() => 
    {
        initDefinitions();
    }, [initDefinitions])

    return (
        <DefinitionContext.Provider value={{ definition, initDefinitions, refreshDefinitions, modifyDefinitions}}>
            {children}
        </DefinitionContext.Provider>
    );
}

export const useDefinitionContext = () => 
{
    const context = useContext(DefinitionContext);
    
    if (context === undefined) 
    {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
