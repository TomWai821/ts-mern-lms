import { Box, Paper, TableContainer } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

// Another Component
import UserFilter from "./Filter/UserFilter";
import CustomTab from "../../UIFragment/CustomTab";
import UserTabPanel from "./Tabs/UserTabPanel";

// Contexts
import { useUserContext } from "../../../Context/User/UserContext";

// Data (CSS Syntax and dropdown data)
import { PaginationOption, UserTabLabel } from "../../../Data/TableData";
import TableTitle from "../../UIFragment/TableTitle";
import { PageItemToCenter } from "../../../Data/Style";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { UserDataInterface } from "../../../Model/UserTableModel";

const UserPage = () =>
{
    const { IsAdmin } = useAuthContext();
    const { userData, fetchUser } = useUserContext();

    const SetTitle = IsAdmin() ? "User Management Page" : "View Suspend List";

    const [searchUserData, setSearchUserData] = useState({ username: "", role: "All", status: "All", gender: "All" });
    const [tabValue, setTabValue] = useState(0);
    const [paginationValue, setPaginationValue] = useState(10);

    const defaultValue = { username: "", role: "All", status: "All", gender: "All" };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = event.target;
        setSearchUserData({ ...searchUserData, [name]: value });
    };

    const SearchUser = useCallback(() => 
    {
        const TableName = ["AllUser", "SuspendUser", "DeleteUser"];
        fetchUser(TableName[tabValue], searchUserData);
    }
    ,[searchUserData, fetchUser, tabValue])

    const changeValue = useCallback((type:string, newValue: number) =>
    {
        switch(type)
        {
            case "Tab":
                setTabValue(newValue);
                break;

            case "Pagination":
                setPaginationValue(newValue);
                break;
            
            default:
                break;
        }
    },[])

    const resetFilter = () => 
    {
        const TableName = ["AllUser", "SuspendUser", "DeleteUser"];
        fetchUser(TableName[tabValue], defaultValue);
        setSearchUserData(defaultValue);
    };

    useEffect(() => 
    { 
        if(!IsAdmin()) 
        { 
            setTabValue(1); 
        }
    },[IsAdmin])
    
    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={SetTitle} dataLength={userData[tabValue].length}/>

            <UserFilter value={tabValue} onChange={onChange} searchData={searchUserData as UserDataInterface} Search={SearchUser} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} paginationValue={paginationValue} tabLabel={UserTabLabel} paginationOption={PaginationOption} type={"User"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
                <UserTabPanel value={tabValue} userData={userData} paginationValue={paginationValue} changeValue={changeValue} setSearchUserData={setSearchUserData} searchUserData={searchUserData}/>
            </TableContainer>
        </Box>
    );
}

export default UserPage