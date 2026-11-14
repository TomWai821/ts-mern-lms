import { CreateDefinitionData, EditDefinitionData, DeleteDefinitionData, GetDefinition } from "../../Controller/BookController/DefinitionController";
import { GetResultInterface } from "../../Model/ResultModel";

export type DefinitionType = "Genre" | "Language";

export async function createDefinition(type: DefinitionType, shortName:string, detailsName:string) 
{
    return CreateDefinitionData(type, shortName, detailsName);
}

export async function editDefinition(type:DefinitionType, id:string, shortName:string, detailsName:string)
{
    return EditDefinitionData(type, id, shortName, detailsName)
}

export async function deleteDefinition(type:DefinitionType, id:string)
{
    return DeleteDefinitionData(type, id);
}

export async function fetchDefinitionData(type: DefinitionType)
{
    const result = await GetDefinition(type);
    const definitionData: GetResultInterface = await result?.json();

    if(definitionData && Array.isArray(definitionData.foundDefinition))
    {
        return definitionData.foundDefinition;
    }

    return [];
}


export async function fetchDefinitionDataWithFliter(type: DefinitionType, isAdmin: boolean, data?:string)
{
    if(!isAdmin)
    {
        return [];
    }

    const result = await GetDefinition(type, data);
    const definitionData: GetResultInterface = await result?.json();

    if(definitionData && Array.isArray(definitionData.foundDefinition))
    {
        return definitionData.foundDefinition;
    }

    return [];
}