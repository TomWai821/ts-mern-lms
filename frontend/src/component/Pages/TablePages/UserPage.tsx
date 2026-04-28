import { Box, Paper, TableContainer } from "@mui/material";
import { useEffect } from "react";

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

// Custom Hook in services (Page Data and Filter)
import { usePageService } from "../../../services/pages/pageService";
import { useUserFilter } from "../../../services/filters/userFilter";

const UserPage = () =>
{
    const { IsAdmin } = useAuthContext();
    const { userData } = useUserContext();

    const { title, tabValue, paginationValue, changeValue } = usePageService("User", IsAdmin);
    const { searchUserData, setSearchUserData, onChange, SearchUser, resetFilter } = useUserFilter(tabValue);

    useEffect(() => 
    { 
        if(!IsAdmin()) 
        { 
            changeValue("Tab", 1); 
        }
    },[IsAdmin, changeValue]);
    
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