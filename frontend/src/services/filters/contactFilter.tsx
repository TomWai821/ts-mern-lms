import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useContactContext } from "../../Context/Book/ContactContext";

const defaultValue = {author: "", publisher: ""};

export const useContactFilter = (tabValue: number) =>
{
    const { fetchContactDataWithFilterData } = useContactContext();
    const [searchContact, setSearchContact] = useState(defaultValue);
    const title = ["Author", "Publisher"];

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSearchContact({...searchContact, [name]: value});
    }

    const SearchContact = () => 
    {
        switch(tabValue)
        {
            case 0:
                fetchContactDataWithFilterData(title[tabValue], searchContact.author);
                break;

            case 1:
                fetchContactDataWithFilterData(title[tabValue], searchContact.publisher);
                break;
        }
    }

    const resetFilter = useCallback(() => 
    {
        fetchContactDataWithFilterData(title[tabValue], "");
        setSearchContact(defaultValue);
    }, [tabValue, fetchContactDataWithFilterData])

    useEffect(() =>
    {
        resetFilter()
    },[tabValue, resetFilter])

    return { searchContact, setSearchContact, onChange, SearchContact, resetFilter };
}
