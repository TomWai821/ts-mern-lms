import { useDefinitionContext } from "../../Context/Book/DefinitionContext";
import { DefinitionInterface, GetResultInterface } from "../../Model/ResultModel";
import { createDefinition, DefinitionType, deleteDefinition, editDefinition } from "../../services/contents/definitionService";
import { useMutation } from "../customhook/useMutation";

export const useDefinitionAction = () => 
{
    const { refreshDefinitions } = useDefinitionContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const CreateDefinition = async (type: string, data: DefinitionInterface) => 
    {
        let response: Response;

        switch(type)
        {
            case "Genre":
                response = await createDefinition(type, data.shortName, data.genre as string);
                break;

            case "Language":
                response = await createDefinition(type, data.shortName, data.language as string);
                break;

            default:
                return;
        }
        
        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshDefinitions(type)]);
    }

    const EditDefinition = async (type: string, compareData: DefinitionInterface, editData: DefinitionInterface) => 
    {
        let response: Response;

        switch(type)
        {
            case "Genre":
                response = await editDefinition(type, compareData._id, editData.shortName, editData.genre as string);
                break;

            case "Language":
                response = await editDefinition(type, compareData._id, editData.shortName, editData.language as string);
                break;

            default:
                return;
        }

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshDefinitions(type)]);
    }

    const DeleteDefinition = async (type: string, deleteData: DefinitionInterface) => 
    {
        const response: Response = await deleteDefinition(type as DefinitionType, deleteData._id);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshDefinitions(type)]);
    }

    return {CreateDefinition, EditDefinition, DeleteDefinition};
}
