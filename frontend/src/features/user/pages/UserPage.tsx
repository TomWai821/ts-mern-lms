"use client";
import { Box, Paper, TableContainer } from "@mui/material";
import { useEffect } from "react";

// Another Component
import CustomTab from "../../../component/UIFragment/CustomTab";
import TableTitle from "../../../component/UIFragment/TableTitle";
import UserFilter from "../components/UserFilter";
import UserTabPanel from "../components/UserTabPanel";

// Contexts
import { useUserContext } from "../../../Context/User/UserContext";

// Data (CSS Syntax and dropdown data)
import { PaginationOption, UserTabLabel } from "../../../Data/TableData";

import { PageItemToCenter } from "../../../Data/Style";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { UserDataInterface } from "../../../Model/UserTableModel";

// Custom Hook in services (Page Data and Filter)
import { getTablePageTitle, usePageService } from "../../../services/pages/pageService";
import { useUserFilter } from "../../../services/filters/userFilter";


const UserPage = () =>
{
    const { isAdmin, isLoggedIn, isAuthLoading } = useAuthContext();
    const { userData, initUsers } = useUserContext();

    const { tabValue, paginationValue, changeValue } = usePageService();

    const { searchUserData, setSearchUserData, onChange, SearchUser, resetFilter } = useUserFilter(tabValue);

    const { title } = getTablePageTitle("User", tabValue, isAdmin);

    useEffect(() => 
    { 
        if (isAuthLoading) return;

        if (!isAdmin) 
        {
            changeValue("Tab", 1);
        }

        initUsers(isAdmin, isLoggedIn, isAuthLoading);
    },[isAuthLoading, isAdmin, isLoggedIn, changeValue, initUsers]);
    
    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={title} dataLength={userData[tabValue].length}/>

            <UserFilter value={tabValue} onChange={onChange} searchData={searchUserData as UserDataInterface} Search={SearchUser} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} paginationValue={paginationValue} tabLabel={UserTabLabel} paginationOption={PaginationOption} type={"User"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
                <UserTabPanel value={tabValue} userData={userData} paginationValue={paginationValue} changeValue={changeValue} setSearchUserData={setSearchUserData} searchUserData={searchUserData}/>
            </TableContainer>
        </Box>
    );
}

export default UserPage