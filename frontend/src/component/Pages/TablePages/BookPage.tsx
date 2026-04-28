import { useEffect } from "react";
import { Box, TableContainer, Paper } from "@mui/material";

// Context
import { useBookContext } from "../../../Context/Book/BookContext";

// Another Component
import BookFilter from "./Filter/BookFilter";
import CustomTab from "../../UIFragment/CustomTab";
import BookTabPanel from "./Tabs/BookTabPanel";
import TableTitle from "../../UIFragment/TableTitle";

// Data (CSS Syntax and dropdown)
import { PageItemToCenter } from "../../../Data/Style";
import { BookTabLabel, PaginationOption } from "../../../Data/TableData";
import { useAuthContext } from "../../../Context/User/AuthContext";

// Custom Hook in services (Page Data and Filter)
import { usePageService } from "../../../services/pages/pageService";
import { useBookFilter } from "../../../services/filters/bookFilter";

const BookPage = () =>
{
    const { bookData } = useBookContext();
    const { IsAdmin } = useAuthContext();

    const { title, tabValue, paginationValue, changeValue } = usePageService("Book", IsAdmin);
    const { searchBook, setSearchBook, onChange, SearchBook, resetFilter } = useBookFilter(tabValue);

    useEffect(() => 
    { 
        if(!IsAdmin()) 
        { 
            changeValue("Tab", 0);
        }
    },[IsAdmin, changeValue])
     
    return( 
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>
            <TableTitle title={title} dataLength={bookData[tabValue].length}/>

            <BookFilter value={tabValue} onChange={onChange} searchData={searchBook} Search={SearchBook} resetFilter={resetFilter}/>

            <CustomTab value={tabValue} changeValue={changeValue} paginationValue={paginationValue} tabLabel={BookTabLabel}
                paginationOption={PaginationOption} type={"Book"}/>

            <TableContainer sx={{ marginTop: 5 }} component={Paper}>
                <BookTabPanel value={tabValue} bookData={bookData} paginationValue={paginationValue} changeValue={changeValue} setSearchBook={setSearchBook} searchBook={searchBook}/>
            </TableContainer>
        </Box>
    );
}

export default BookPage