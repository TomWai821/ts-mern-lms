import { FC, Fragment } from "react";
import { Avatar, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";
import ActionTableCell from "../../shared/mangers/ActionTableCellManager";

// Models
import { BookRecordTableInterface, BookSearchInterface } from "../../../Model/BookTableModel";

// Data (CSS Syntax and table header)
import { LoanBookTableHeader } from "../../../Data/TableData";
import { ItemToCenter } from "../../../Data/Style";
import { LoanBookInterface } from "../../../Model/ResultModel";
import { TransferDateToISOString } from "../../../Controller/OtherController";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { setLoanBookDataTextColor } from "../../../Controller/SetTextController";
import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface LoanBookTableCellInterface
{
    paginatedData: LoanBookInterface[];
    TableName: tableNameType
    value: number;
    setSearchBook?: ((data: BookSearchInterface) => void) | undefined;
    searchBook?:  BookSearchInterface | undefined;
    paginationPageVariable : { paginationValue: number; page: number };
}

const LoanBookTableCell = (propsData: LoanBookTableCellInterface) => 
{
    const { paginatedData, TableName, value, setSearchBook, searchBook, paginationPageVariable } = propsData;
    const { isAdmin } = useAuthContext();

    return(
        paginatedData.map((data, index) => 
            (
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{"&:hover": {cursor: "pointer"}}}>{(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}</TableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}>
                        <Avatar src={data.bookDetails?.image?.url} alt="Preview" variant="rounded" sx={{ width: "150px", height: "225px" }}/>
                    </ContentTableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}>{data.bookDetails?.bookname}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}>{data.userDetails?.username}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}>{TransferDateToISOString(data.loanDate as Date)}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}>{TransferDateToISOString(data.dueDate as Date)}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data} textColor={setLoanBookDataTextColor(data.status)}>{data.status}</ContentTableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}> 
                        { data.returnDate !== null ? TransferDateToISOString(data.returnDate as Date): "N/A"}
                    </ContentTableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data} textColor={setLoanBookDataTextColor(data.finesPaid as string)}>
                        { data.fineAmount as number > 0 && data.finesPaid === "Not Paid" ? "Not Paid" : data.finesPaid }
                    </ContentTableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}> HKD$ { data.fineAmount } </ContentTableCell>

                    {isAdmin && 
                        (
                            <ActionTableCell value={value} TableName={TableName} Information={data} setSearchBook={setSearchBook} searchBook={searchBook}/>
                        )
                    }
                </TableRow>
            )
        )
    )
}

const LoanBookTable:FC<BookRecordTableInterface> = (DataForAllUserTable) => 
{
    const { value, bookData, paginationValue, setSearchBook, searchBook } = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<LoanBookInterface>(bookData[value] as LoanBookInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Book";
    
    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {LoanBookTableHeader.map((header, index) =>
                            (
                                <TableCell key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                {
                   LoanBookTableCell({paginatedData, TableName, value, setSearchBook, searchBook, paginationPageVariable})
                }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default LoanBookTable
