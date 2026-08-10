import { createContext, FC, useCallback, useContext, useEffect } from "react";
import { ChildProps, DefinatonProps } from "../../Model/ContextAndProviderModel";

import { DefinitionInterface, GetResultInterface } from "../../Model/ResultModel";
import { CreateDefinitionData, DeleteDefinitionData, EditDefinitionData, GetDefinition } from "../../Controller/BookController/DefinitionController";

import { useAuthContext } from "../User/AuthContext";
import { useDefinitionReducer } from "../../Reducer/DefinitionReducer";
import { DefinitionwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { useWebSocket } from "../../services/ws/useWebSocket";

const DefinitionContext = createContext<DefinatonProps | undefined>(undefined);

export const DefinitionProvider:FC<ChildProps> = ({children}) => 
{
    const { GetData } = useAuthContext();
    const { state, dispatch } = useDefinitionReducer();
    
    const definition = [state.Genre, state.Language];
    
    const authToken = GetData("authToken") as string;

    useWebSocket(dispatch, DefinitionwsEventToActionMap);

    const fetchAllDefinition = useCallback(async () => 
    {
        const [getGenreData, getLanguageData] = await Promise.allSettled([GetDefinition("Genre"), GetDefinition("Language")])

        if(getGenreData.status === "fulfilled" && getGenreData.value)
        {
            const GenreResponse = getGenreData.value;
            const GenreData: GetResultInterface = await GenreResponse.json();

            if(Array.isArray(GenreData.foundDefinition as DefinitionInterface[]))
            {
                dispatch({ type: "SET_GENRE", payload: GenreData.foundDefinition as DefinitionInterface[] });
            }
        }
        
        if(getLanguageData.status === "fulfilled" && getLanguageData.value)
        {
            const LanguageResponse = getLanguageData.value;
            const LanguageData: GetResultInterface = await LanguageResponse.json();

            if(Array.isArray(LanguageData.foundDefinition as DefinitionInterface[]))
            {
                dispatch({ type: "SET_LANGUAGE", payload: LanguageData.foundDefinition as DefinitionInterface[] });
            }
        }    
    }
    ,[dispatch])

    const fetchDefinitionDataWithFilterData = useCallback(async (type:string, data?:string) => 
    {
        const getData = await GetDefinition(type, data);
    
        if((getData as Response).ok)
        {
            const DefinitionData: GetResultInterface = await (getData as Response).json();

            if(Array.isArray(DefinitionData.foundDefinition as DefinitionInterface[]))
            {
                
                switch(type)
                {
                    case "Genre":
                        dispatch({ type: "SET_GENRE", payload: DefinitionData.foundDefinition as DefinitionInterface[] });
                        break;
        
                    case "Language":
                        dispatch({ type: "SET_LANGUAGE", payload: DefinitionData.foundDefinition as DefinitionInterface[] });
                        break;
                }
            }
        }
    }
    ,[dispatch])

    const createDefinition = useCallback(async (type:string, shortName:string, detailsName:string) => 
    {
        const result: Response = await CreateDefinitionData(type, authToken, shortName, detailsName);
        return result;
    }
    ,[authToken])

    const editDefinition = useCallback( async (type:string, id:string, shortName:string, detailsName:string) => 
    {
        const result: Response = await EditDefinitionData(type, authToken, id, shortName, detailsName);
        return result;
    }
    ,[authToken])

    const deleteDefinition = useCallback(async (type:string, id:string) => 
    {
        const result: Response = await DeleteDefinitionData(type, authToken, id);
        return result;
    }
    ,[authToken])

    useEffect(() => 
    {
        fetchAllDefinition();
    }
    ,[fetchAllDefinition])

    return (
        <DefinitionContext.Provider value={{ definition, fetchAllDefinition, fetchDefinitionDataWithFilterData, createDefinition, editDefinition, deleteDefinition}}>
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
