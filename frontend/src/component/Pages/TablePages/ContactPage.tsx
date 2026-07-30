import { useEffect } from "react";
import { Box, TableContainer, Paper } from "@mui/material";

// Another Component
import ContactFilter from "./Filter/ContactFilter";
import CustomTab from "../../UIFragment/CustomTab";
import TableTitle from "../../UIFragment/TableTitle";

// Data (CSS Syntax and dropdown)
import { PageItemToCenter } from "../../../Data/Style";
import { ContactTabLabel, PaginationOption } from "../../../Data/TableData";
import { useContactContext } from "../../../Context/Book/ContactContext";

import ContactTabPanel from "./Tabs/ContactTabPanel";

import { ChangePage } from "../../../Controller/OtherController";
import { useAuthContext } from "../../../Context/User/AuthContext";

// Custom Hook in services
import { getTablePageTitle, usePageService } from "../../../services/pages/pageService";
import { useContactFilter } from "../../../services/filters/contactFilter";

const ContactPage = () =>
{
    const { IsAdmin } = useAuthContext();
    const { contact } = useContactContext();

    const { tabValue, paginationValue, changeValue } = usePageService();
    const { searchContact, onChange, SearchContact, resetFilter } = useContactFilter(tabValue);

    const { title } = getTablePageTitle("Contact", tabValue, IsAdmin);

    useEffect(() => 
    {
        if(!IsAdmin())
        {
            ChangePage('/');
        }
    },[IsAdmin])
    
    return( 
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={title} dataLength={contact[tabValue].length}/>

            <ContactFilter value={tabValue} onChange={onChange} searchData={searchContact} Search={SearchContact} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} 
                paginationValue={paginationValue} tabLabel={ContactTabLabel} paginationOption={PaginationOption} type={"Contact"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
                <ContactTabPanel value={tabValue} contactData={contact} paginationValue={paginationValue}/>
            </TableContainer>
        </Box>
    );
}

export default ContactPage