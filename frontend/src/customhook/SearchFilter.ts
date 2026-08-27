import { ChangeEvent, useState } from "react";

export const useSearchFilter = <T extends Record<string, any>> (defaultData: T) => 
{
    const [searchData, setSearchData] = useState(defaultData);
    const defaultValue = defaultData;

    const resetSearchData = () => 
    {
        setSearchData(defaultValue);
    }

    const changeSearchData = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchData({ ...searchData, [name]: value });
    };

    return {searchData, resetSearchData, changeSearchData};
}