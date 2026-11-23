import { ChangeEvent, useCallback, useState } from "react";
import { ContactType, fetchContactDataWithFliter } from "../contents/contactService";
import { useAuthContext } from "../../Context/User/AuthContext";
import { useContactContext } from "../../Context/Book/ContactContext";

const defaultValue = {author: "", publisher: ""};
const title = ["Author", "Publisher"] as ContactType[];

export const useContactFilter = (tabValue: number) =>
{
    const [searchContact, setSearchContact] = useState(defaultValue);
    const {isAdmin} = useAuthContext();
    const { refreshContacts, modifyContacts } = useContactContext();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSearchContact({...searchContact, [name]: value});
    }

    const SearchContact = async() => 
    {
        const appliedSearchData = tabValue === 0 ? searchContact.author : searchContact.publisher;
        const actionType = tabValue === 0 ? "SET_AUTHOR" : "SET_PUBLISHER";

        const searchResult = await fetchContactDataWithFliter(title[tabValue], isAdmin, appliedSearchData);
        modifyContacts({type: actionType, payload: searchResult});
    }

    const resetFilter = useCallback(() => 
    {
        refreshContacts(title[tabValue]);
        setSearchContact(defaultValue);
    }, [tabValue, refreshContacts])

    return { searchContact, setSearchContact, onChange, SearchContact, resetFilter };
}
