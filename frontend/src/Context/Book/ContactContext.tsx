import { createContext, FC, useCallback, useContext, useEffect, useReducer } from "react";

import { CreateContact, DeleteContact, EditContact, GetContact } from "../../Controller/BookController/ContactController";

import { ChildProps, ContactProps } from "../../Model/ContextAndProviderModel";
import { ContactInterface, GetResultInterface } from "../../Model/ResultModel";

import { useAuthContext } from "../User/AuthContext";

interface ContactState
{
    Author: ContactInterface[];
    Publisher: ContactInterface[];
}

type ContactAction =
    | { type: "SET_AUTHOR"; payload: ContactInterface[] }
    | { type: "SET_PUBLISHER"; payload: ContactInterface[] };

const initialState: ContactState = 
{
    Author: [],
    Publisher: [],
};

const contactReducer = (state: ContactState, action: ContactAction): ContactState => 
{
    switch (action.type) 
    {
        case "SET_AUTHOR":
            return { ...state, Author: action.payload };

        case "SET_PUBLISHER":
            return { ...state, Publisher: action.payload };

        default:
            return state;
    }
};

const ContactContext = createContext<ContactProps | undefined>(undefined);

export const ContactProvider:FC<ChildProps> = ({children}) => 
{
    const [state, dispatch] = useReducer(contactReducer, initialState);
    const contact = [state.Author, state.Publisher];

    const {GetData} = useAuthContext();
    const authToken = GetData("authToken") as string;

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
    ,[])

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
    ,[])

    const createContactData = useCallback(async (type:string, contactName:string, phoneNumber:string, email:string) => 
    {
        const result: Response = await CreateContact(authToken, type, contactName, phoneNumber, email);

        if(result)
        {
            fetchAllContactData();
        }
        return result;
    }
    ,[fetchAllContactData, authToken])

    const editContactData = useCallback( async (type:string, id:string, contactName:string, phoneNumber:string, email:string) => 
    {
        const result: Response = await EditContact(authToken, type, contactName, phoneNumber, email, id);

        if(result)
        {
            fetchAllContactData();
        }
        return result;
    }
    ,[fetchAllContactData, authToken])

    const deleteContactData = useCallback(async (type:string, id:string) => 
    {
        const result: Response = await DeleteContact(authToken, type, id);

        if(result)
        {
            fetchAllContactData();
        }
        return result;
    }
    ,[fetchAllContactData, authToken])

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
