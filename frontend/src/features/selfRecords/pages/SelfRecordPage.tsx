"use client";
import { useEffect } from "react"
import { Box, Paper,  TableContainer } from "@mui/material"

// UI Fragment and another useful component
import SelfRecordTabPanel from "../components/SelfRecordTabPanel";
import SelfRecordFilter from "../components/SelfRecordFilter";
import TableTitle from "../../../component/UIFragment/TableTitle";
import CustomTab from "../../../component/UIFragment/CustomTab";

// Useful function(Controller)
import { ChangePage } from "../../../Controller/OtherController";

// Useful data
import { BookRecordTabLabel, PaginationOption } from "../../../Data/TableData";
import { PageItemToCenter } from "../../../Data/Style"

// Context
import { useAuthContext } from "../../../Context/User/AuthContext";
import { useSelfBookRecordContext } from "../../../Context/Book/SelfBookRecordContext";

// Custom Hook in services (Page Data and Filter)
import { getTablePageTitle, usePageService } from "../../../services/pages/pageService";
import { useSelfRecordFilter } from "../../../services/filters/selfRecordFilter";


const SelfRecordPage = () => 
{
    const { isLoggedIn, isAuthLoading } = useAuthContext();
    const { BookRecordForUser, initSelfRecords } = useSelfBookRecordContext();

    const { tabValue, paginationValue, changeValue } = usePageService();
    const { searchData, onChange, searchSelfRecord, resetFilter } = useSelfRecordFilter(tabValue);
    const { title } = getTablePageTitle("SelfRecord", tabValue);

    useEffect(() => 
    {
        if(isAuthLoading) return;

        if(!isLoggedIn)
        {
            ChangePage('/');
        }
        
        initSelfRecords();
    },[isLoggedIn])

    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={title} dataLength={BookRecordForUser[tabValue].length}/>

            <SelfRecordFilter value={tabValue} onChange={onChange} searchData={searchData} Search={searchSelfRecord} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} 
                paginationValue={paginationValue} tabLabel={BookRecordTabLabel} paginationOption={PaginationOption} type={"Record"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
               <SelfRecordTabPanel value={tabValue} bookData={BookRecordForUser} paginationValue={paginationValue}/>
            </TableContainer>
        </Box>
    )
}

export default SelfRecordPage