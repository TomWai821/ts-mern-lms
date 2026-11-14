import { useContactContext } from "../../Context/Book/ContactContext";
import { ContactInterface, GetResultInterface } from "../../Model/ResultModel";
import { createContact, ContactType, deleteContact, editContact } from "../../services/contents/contactService";
import { useMutation } from "../customhook/useMutation";

const detectNullData = (data:string) =>
{
    return data === "" ? "N/A" : data;
}

export const useContactAction = () => 
{
    const { refreshContacts } = useContactContext();
    const { MutationFeedback, executeMutationAndSync } = useMutation();

    const CreateContact = async (type: string, data: ContactInterface) => 
    {
        let response: Response;

        switch(type)
        {
            case "Author":
                response = await createContact(type, data.author as string, data.phoneNumber, data.email);
                break;

            case "Publisher":
                response = await createContact(type, data.author as string, data.phoneNumber, data.email);
                break;

            default:
                return;
        }
        
        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshContacts(type)]);
    }

    const EditContact = async (type: string, compareData: ContactInterface, editData: ContactInterface) => 
    {
        let response: Response;

        switch(type)
        {
            case "Author":
                response = await editContact(type, compareData._id, editData.author as string, detectNullData(editData.phoneNumber), detectNullData(editData.email));
                break;

            case "Publisher":
                response = await editContact(type, compareData._id, editData.author as string, detectNullData(editData.phoneNumber), detectNullData(editData.email));
                break;

            default:
                return;
        }

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshContacts(type)]);
    }

    const DeleteContact = async (type: string, deleteData: ContactInterface) => 
    {
        const response: Response = await deleteContact(type as ContactType, deleteData._id);

        const result: GetResultInterface = await response.json();
        await MutationFeedback(response, result);
        await executeMutationAndSync(response, [() => refreshContacts(type)]);
    }

    return {CreateContact, EditContact, DeleteContact};
}
