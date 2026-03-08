import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { CreateDefinitionData, DeleteDefinitionData, EditDefinitionData, GetDefinition } from "../../Controller/BookController/DefinitionController";
import { ChildProps, DefinatonProps } from "../../Model/ContextAndProviderModel";
import { DefinitionInterface, DefinitionState, GetResultInterface } from "../../Model/ResultModel";
import { useAuthContext } from "../User/AuthContext";

const DefinitionContext = createContext<DefinatonProps | undefined>(undefined);

export const DefinitionProvider:FC<ChildProps> = ({children}) => 
{
    const {GetData} = useAuthContext();
    const [definition, setDefinition] = useState<DefinitionState>(
        {
            Genre:[],
            Language:[]
        }
    );
    const authToken = GetData("authToken") as string;

    const fetchAllDefinition = useCallback(async () => 
    {
        const getGenreData: GetResultInterface | undefined = await GetDefinition("Genre");
        const getLanguageData : GetResultInterface | undefined = await GetDefinition("Language");

        if(getGenreData && Array.isArray(getGenreData.foundDefinition as DefinitionInterface[]))
        {
            setDefinition((prev) => ({...prev, Genre:getGenreData.foundDefinition as DefinitionInterface[]}));
        }

        if(getLanguageData && Array.isArray(getLanguageData.foundDefinition as DefinitionInterface[]))
        {
            setDefinition((prev) => ({...prev, Language:getLanguageData.foundDefinition as DefinitionInterface[]}));
        }
    }
    ,[])

    const fetchDefinitionDataWithFilterData = useCallback(async (type:string, data?:string) => 
    {
        const getData: GetResultInterface | undefined = await GetDefinition(type, data);
    
        if(getData && Array.isArray(getData.foundDefinition as DefinitionInterface[]))
        {
            switch(type)
            {
                case "Genre":
                    setDefinition((prev) => ({...prev, Genre:getData.foundDefinition as DefinitionInterface[]}));
                    break;
    
                case "Language":
                    setDefinition((prev) => ({...prev, Language:getData.foundDefinition as DefinitionInterface[]}));
                    break;
            }
        }
    }
    ,[])

    const createDefinition = useCallback(async (type:string, shortName:string, detailsName:string) => 
    {
        const result: Response = await CreateDefinitionData(type, authToken, shortName, detailsName);

        if(result)
        {
            fetchAllDefinition();
        }
        return result;
    }
    ,[fetchAllDefinition, authToken])

    const editDefinition = useCallback( async (type:string, id:string, shortName:string, detailsName:string) => 
    {
        const result: Response = await EditDefinitionData(type, authToken, id, shortName, detailsName);

        if(result)
        {
            fetchAllDefinition();
        }
        return result;
    }
    ,[fetchAllDefinition, authToken])

    const deleteDefinition = useCallback(async (type:string, id:string) => 
    {
        const result: Response = await DeleteDefinitionData(type, authToken, id);

        if(result)
        {
            fetchAllDefinition();
        }
        return result;
    }
    ,[fetchAllDefinition, authToken])

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
