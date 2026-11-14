import { ChangeEvent, useCallback, useState } from "react";
import { useUserContext } from "../../Context/User/UserContext";
import { useAuthContext } from "../../Context/User/AuthContext";
import { fetchUsersWithFilter, fetchSuspendUserWithFilter } from "../contents/userService";
import { UserResultDataInterface } from "../../Model/ResultModel";

const defaultValue = { username: "", role: "All", status: "All", gender: "All" };
const TableName = ["AllUser", "SuspendUser"];

export const useUserFilter = (tabValue:number) => 
{
    const { modifyUsers, refreshUsers } = useUserContext();
    const { isAdmin, isLoggedIn, isAuthLoading } = useAuthContext();

    const [searchUserData, setSearchUserData] = useState(defaultValue);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchUserData({ ...searchUserData, [name]: value });
    };

    const SearchUser = useCallback(async() => 
    {
        const result = tabValue === 0 ? 
            await fetchUsersWithFilter(searchUserData) as UserResultDataInterface[] 
            : 
            await fetchSuspendUserWithFilter(searchUserData) as UserResultDataInterface[];

        const actionType = tabValue === 0 ? "SET_SUSPEND_USER": "SET_SUSPEND_USER";
        modifyUsers({type: actionType, payload: result});
    }
    ,[tabValue, TableName, searchUserData])

    const resetFilter = useCallback(() => 
    {
        setSearchUserData(defaultValue);
        refreshUsers(TableName[tabValue], isAdmin, isLoggedIn, isAuthLoading);
    }, [tabValue, TableName]);

    return { searchUserData, setSearchUserData, onChange, SearchUser, resetFilter };
}