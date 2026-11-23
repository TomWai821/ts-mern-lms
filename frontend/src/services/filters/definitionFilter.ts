import { ChangeEvent, useCallback, useState } from "react";
import { DefinitionType, fetchDefinitionDataWithFliter } from "../contents/definitionService";
import { useAuthContext } from "../../Context/User/AuthContext";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";

const defaultValue = {genre:"", language: ""};
const title = ["Genre", "Language"] as DefinitionType[];

export const useDefinitionFilter = (tabValue: number) =>
{
    const [searchData, setSearchData] = useState({genre:"", language: ""});
    const {isAdmin} = useAuthContext();
    const {refreshDefinitions, modifyDefinitions} = useDefinitionContext();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSearchData({...searchData, [name]: value});
    }

    const SearchDefinition = async () => 
    {
        const appliedSearchData = tabValue === 0 ? searchData.genre : searchData.language;
        const actionType = tabValue === 0 ? "SET_GENRE" : "SET_LANGUAGE";

        const searchResult = await fetchDefinitionDataWithFliter(title[tabValue], isAdmin, appliedSearchData);
        modifyDefinitions({type: actionType, payload: searchResult});
    }

    const resetFilter = useCallback(() => 
    {
        setSearchData(defaultValue);
        refreshDefinitions(title[tabValue]);
    },[tabValue, refreshDefinitions])

    return { searchData, onChange, SearchDefinition, resetFilter };
}