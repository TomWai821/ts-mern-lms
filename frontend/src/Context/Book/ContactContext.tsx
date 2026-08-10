import { createContext, FC, useCallback, useContext, useEffect } from "react";

import { CreateContact, DeleteContact, EditContact, GetContact } from "../../Controller/BookController/ContactController";

import { ChildProps, ContactProps } from "../../Model/ContextAndProviderModel";
import { ContactInterface, GetResultInterface } from "../../Model/ResultModel";

import { useAuthContext } from "../User/AuthContext";
import { useContactReducer } from "../../Reducer/ContactReducer";
import { ContactwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { useWebSocket } from "../../services/ws/useWebSocket";

const ContactContext = createContext<ContactProps | undefined>(undefined);

export const ContactProvider:FC<ChildProps> = ({children}) => 
{
    const { state, dispatch } = useContactReducer();
    const contact = [state.Author, state.Publisher];

    const {GetData} = useAuthContext();
    const authToken = GetData("authToken") as string;

    await useWebSocket(dispatch, ContactwsEventToActionMap);

    const fetchAllContactData = useCallback(async () => 
    {
        const [getAuthorData, getPublisherData] = await Promise.allSettled([GetContact("Author", undefined), GetContact("Publisher", undefined)])
        
        if(getAuthorData.status === "fulfilled" && getAuthorData.value)
        {
            const AuthorResponse = getAuthorData.value;
            const AuthorData: GetResultInterface = await AuthorResponse.json();

            if(Array.isArray(AuthorData.foundContact as ContactInterface[]))
            {
                dispatch({ type: "SET_AUTHOR", payload: AuthorData.foundContact as ContactInterface[] });
            }
        }
        
        if(getPublisherData.status === "fulfilled" && getPublisherData.value)
        {
            const PublisherResponse = getPublisherData.value;
            const PublisherData: GetResultInterface = await PublisherResponse.json();

            if(Array.isArray(PublisherData.foundContact as ContactInterface[]))
            {
                dispatch({ type: "SET_PUBLISHER", payload: PublisherData.foundContact as ContactInterface[] });
            }
        }
    }
    ,[dispatch])

    const fetchContactDataWithFilterData = useCallback(async (type:string, filtData:string) => 
    {
        const getData = await GetContact(type, filtData);
            
        if((getData as Response).ok)
        {
            const ContactData: GetResultInterface = await (getData as Response).json();

            if(Array.isArray(ContactData.foundContact as ContactInterface[]))
            {
                switch(type)
                {
                    case "Author":
                        dispatch({ type: "SET_AUTHOR", payload: ContactData.foundContact as ContactInterface[] });
                        break;

                    case "Publisher":
                        dispatch({ type: "SET_PUBLISHER", payload: ContactData.foundContact as ContactInterface[] });
                        break;
                }
            }
        }
    }
    ,[dispatch])

    const createContactData = useCallback(async (type:string, contactName:string, phoneNumber:string, email:string) => 
    {
        const result: Response = await CreateContact(authToken, type, contactName, phoneNumber, email);
        return result;
    }
    ,[authToken])

    const editContactData = useCallback( async (type:string, id:string, contactName:string, phoneNumber:string, email:string) => 
    {
        const result: Response = await EditContact(authToken, type, contactName, phoneNumber, email, id);
        return result;
    }
    ,[authToken])

    const deleteContactData = useCallback(async (type:string, id:string) => 
    {
        const result: Response = await DeleteContact(authToken, type, id);
        return result;
    }
    , [authToken])

    useEffect(() => 
    {
        fetchAllContactData();
    }
    ,[fetchAllContactData])

    return (
        <ContactContext.Provider value={{ contact, fetchAllContactData, fetchContactDataWithFilterData, createContactData, editContactData, deleteContactData}}>
            {children}
        </ContactContext.Provider>
    );
}

export const useContactContext = () => 
{
    const context = useContext(ContactContext);
    
    if (context === undefined) 
    {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
