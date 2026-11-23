import { createContext, FC, useCallback, useContext, useEffect } from "react";

import { ChildProps } from "../../Model/ContextAndProviderModel";
import { ContactInterface } from "../../Model/ResultModel";

import { useContactReducer } from "../../Reducer/ContactReducer";
import { ContactwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { useWebSocket } from "../../hooks/customhook/WebSocket";
import { fetchContactData } from "../../services/contents/contactService";
import { AuthorAction } from "../../Reducer/Contact/AuthorReducer";
import { PublisherAction } from "../../Reducer/Contact/PublisherReducer";

export interface ContactProps
{
    contact: ContactInterface[][];
    initContacts: () => Promise<void>;
    refreshContacts: (type: string) => Promise<void>;
    modifyContacts: (action: AuthorAction | PublisherAction) => void;
}

const ContactContext = createContext<ContactProps | undefined>(undefined);

export const ContactProvider:FC<ChildProps> = ({children}) => 
{
    const { state, dispatch } = useContactReducer();
    const contact = [state.Author, state.Publisher];

    useWebSocket(dispatch, ContactwsEventToActionMap);

    const initContacts = useCallback(async () =>
    {
        const [author, publisher] = await Promise.allSettled([fetchContactData("Author"), fetchContactData("Publisher")]);

        const authorResult: ContactInterface[] | undefined = author.status === 'fulfilled' ? author.value : undefined; 
        const publisherResult: ContactInterface[] | undefined = publisher.status === 'fulfilled' ? publisher.value : undefined;

        if(authorResult && Array.isArray(authorResult))
        {
            dispatch({ type: "SET_AUTHOR", payload: authorResult });
        }

        if(publisherResult && Array.isArray(publisherResult))
        {
            dispatch({ type: "SET_PUBLISHER", payload: publisherResult });
        }
    }, [dispatch]);

    const refreshContacts = async (type:string) => 
    {
        const result = type === "Author" ? await fetchContactData("Author") : await fetchContactData("Publisher");
        const actionType = type === "Author" ? "SET_AUTHOR": "SET_PUBLISHER"
        
        dispatch({ type: actionType, payload: result });
    }

    const modifyContacts = (action: AuthorAction | PublisherAction) => 
    {
        dispatch(action);
    }

    useEffect(() => 
    {
        initContacts();
    }, [initContacts])

    return (
        <ContactContext.Provider value={{ contact, initContacts, refreshContacts, modifyContacts}}>
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
