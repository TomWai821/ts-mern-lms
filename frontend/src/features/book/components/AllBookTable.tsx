import { FC, Fragment } from "react";
import { Avatar, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";
import ActionTableCell from "../../shared/mangers/ActionTableCellManager";

// Models
import { BookRecordTableInterface, BookSearchInterface } from "../../../Model/BookTableModel";
import { AllBookTableHeader } from "../../../Data/TableData";
import { ItemToCenter } from "../../../Data/Style";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { setDataTextColor } from "../../../Controller/SetTextController";
import { BookDataInterface } from "../../../Model/ResultModel";
import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface AllTableCellInterface
{
    paginatedData: BookDataInterface[];
    TableName: tableNameType;
    value: number;
    changeValue?: (type: string, newValue: number) => void;
    isLoggedIn: boolean;
    searchBookData: { setSearchBook: ((data: BookSearchInterface) => void) | undefined; searchBook: BookSearchInterface | undefined };
    paginationPageVariable : { paginationValue: number; page: number };
}

const AllBookTableCell = (propsData: AllTableCellInterface) => 
{
    const {paginatedData, TableName, value, isLoggedIn, searchBookData, paginationPageVariable, changeValue} = propsData;

    return(
        paginatedData.map((data, index) => 
        (
            <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                <TableCell sx={{fontSize: "16px", "&:hover": {cursor: "pointer"}}}>{(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}</TableCell>

                <ContentTableCell TableName={TableName} value={value} Information={data}>
                    <Avatar src={data.image?.url} alt="Preview" variant="rounded" sx={{width: "150px", height: "225px"}}/>
                </ContentTableCell>

                <ContentTableCell TableName={TableName} value={value} Information={data}>{data.bookname}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={value} Information={data}>{data.genreDetails?.genre}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={value} Information={data}>{data.languageDetails?.language}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={value} Information={data}>{data.authorDetails?.author}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={value} Information={data}>{data.publisherDetails?.publisher}</ContentTableCell>

                {isLoggedIn && 
                    (
                        <Fragment>
                            <ContentTableCell TableName={TableName} value={value} Information={data} textColor={setDataTextColor(data.status, "OnShelf", "green", "red" )}>{data.status}</ContentTableCell>
                            
                            <ActionTableCell value={value} TableName={TableName} Information={data} 
                                changeValue={changeValue as (type: string, newValue: number) => void} setSearchBook={searchBookData.setSearchBook} searchBook={searchBookData.searchBook}
                            />
                        </Fragment>
                    )
                }
            </TableRow>
        )
    ))
}

const AllBookTable:FC<BookRecordTableInterface> = (DataForAllUserTable) => 
{
    const { value, bookData, paginationValue, changeValue, setSearchBook, searchBook } = DataForAllUserTable;
    const { isLoggedIn } = useAuthContext();

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<BookDataInterface>(bookData[value] as BookDataInterface[], paginationValue);
    const searchBookData = {setSearchBook, searchBook};
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Book";
    
    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {AllBookTableHeader.map((header, index) =>
                            (
                                (header.isLoggedIn && !isLoggedIn) ? null : 
                                <TableCell sx={{fontSize: '16px'}} key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        AllBookTableCell({paginatedData, TableName, value, isLoggedIn, searchBookData, paginationPageVariable, changeValue})
                    }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default AllBookTable