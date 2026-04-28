import { useEffect } from "react"
import { Box, Paper,  TableContainer } from "@mui/material"

// UI Fragment and another useful component
import TableTitle from "../../UIFragment/TableTitle";
import CustomTab from "../../UIFragment/CustomTab";
import RecordFilter from "./Filter/RecordFilter";
import SelfRecordTabPanel from "./Tabs/SelfRecordTabPanel";

// Useful function(Controller)
import { ChangePage } from "../../../Controller/OtherController";

// Useful data
import { BookRecordTabLabel, PaginationOption } from "../../../Data/TableData";
import { PageItemToCenter } from "../../../Data/Style"

// Context
import { useAuthContext } from "../../../Context/User/AuthContext";
import { useSelfBookRecordContext } from "../../../Context/Book/SelfBookRecordContext";

// Custom Hook in services (Page Data and Filter)
import { usePageService } from "../../../services/pages/pageService";
import { useSelfRecordFilter } from "../../../services/filters/selfRecordFIlter";

const SelfRecordPage = () => 
{
    const { IsLoggedIn } = useAuthContext();
    const { BookRecordForUser} = useSelfBookRecordContext();

    const { title, tabValue, paginationValue, changeValue } = usePageService("SelfRecord");
    const { searchData, onChange, searchSelfRecord, resetFilter } = useSelfRecordFilter(tabValue);

    useEffect(() => 
    {
        if(!IsLoggedIn())
        {
            ChangePage('/');
        }
    },[IsLoggedIn])

    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={title} dataLength={BookRecordForUser[tabValue].length}/>

            <RecordFilter value={tabValue} onChange={onChange} searchData={searchData} Search={searchSelfRecord} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} 
                paginationValue={paginationValue} tabLabel={BookRecordTabLabel} paginationOption={PaginationOption} type={"Record"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
               <SelfRecordTabPanel value={tabValue} bookData={BookRecordForUser} paginationValue={paginationValue}/>
            </TableContainer>
        </Box>
    )
}

export default SelfRecordPage