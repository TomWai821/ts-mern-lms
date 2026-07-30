import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDefinitionContext } from "../../Context/Book/DefinitionContext";


const defaultValue = {genre:"", language: ""};

export const useDefinitionFilter = (tabValue: number) =>
{
    const { fetchDefinitionDataWithFilterData } = useDefinitionContext();
    const [searchData, setSearchData] = useState({genre:"", language: ""});
    const title = ["Genre", "Language"];

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {name, value} = event.target;
        setSearchData({...searchData, [name]: value});
    }

    const SearchDefinition = () => 
    {
        switch(tabValue)
        {
            case 0:
                fetchDefinitionDataWithFilterData(title[tabValue], searchData.genre);
                break;
            
            case 1:
                fetchDefinitionDataWithFilterData(title[tabValue], searchData.language);
                break;
        }
    }

    const resetFilter = useCallback(() => 
    {
        fetchDefinitionDataWithFilterData(title[tabValue], "");
        setSearchData(defaultValue);
    },[tabValue, fetchDefinitionDataWithFilterData])

    useEffect(() =>
    {
        resetFilter()
    },[tabValue, resetFilter])

    return { searchData, onChange, SearchDefinition, resetFilter };
}