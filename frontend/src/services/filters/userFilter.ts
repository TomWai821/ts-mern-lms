import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useUserContext } from "../../Context/User/UserContext";

const defaultValue = { username: "", role: "All", status: "All", gender: "All" };

export const useUserFilter = (tabValue:number) => 
{
    const { fetchUser } = useUserContext();
    const [searchUserData, setSearchUserData] = useState(defaultValue);

    const TableName = useMemo(() => ["AllUser", "SuspendUser"], []);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchUserData({ ...searchUserData, [name]: value });
    };

    const SearchUser = useCallback(() => 
    {
        fetchUser(TableName[tabValue], searchUserData);
    }
    ,[tabValue, TableName, searchUserData, fetchUser])

    const resetFilter = useCallback(() => 
    {
        fetchUser(TableName[tabValue], defaultValue);
        setSearchUserData(defaultValue);
    }, [tabValue, TableName, fetchUser]);

    return { searchUserData, setSearchUserData, onChange, SearchUser, resetFilter };
}