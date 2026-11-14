import { CreateContact, EditContact, DeleteContact, GetContact } from "../../Controller/BookController/ContactController";
import { GetResultInterface } from "../../Model/ResultModel";

export type ContactType = "Author" | "Publisher";

export async function createContact( type:ContactType, contactName:string, phoneNumber:string, email:string)
{
    return CreateContact(type, contactName, phoneNumber, email);
}


export async function editContact(type:ContactType, id:string, contactName:string, phoneNumber:string, email:string)
{
    return EditContact(type, contactName, phoneNumber, email, id);
}


export async function deleteContact(type:ContactType, id:string)
{
    return DeleteContact(type, id);
}


export async function fetchContactData(type: ContactType)
{
    const result = await GetContact(type);
    const contactData: GetResultInterface = await result?.json();

    if(contactData && Array.isArray(contactData.foundContact))
    {
        return contactData.foundContact;
    }

    return [];
}


export async function fetchContactDataWithFliter(type: ContactType, isAdmin: boolean, data?:string)
{
    if(!isAdmin)
    {
        return [];
    }

    const result = await GetContact(type, data);
    const contactData: GetResultInterface = await result?.json();

    if(contactData && Array.isArray(contactData.foundContact))
    {
        return contactData.foundContact;
    }

    return [];
}