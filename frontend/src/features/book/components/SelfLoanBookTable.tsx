import { Avatar, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FC, Fragment } from "react";

import { ItemToCenter } from "../../../Data/Style";

import { SelfLoanBookTableHeader } from "../../../Data/TableData";

// Custom Table cell
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";

// Models (Interface)
import { LoanBookInterface } from "../../../Model/ResultModel";
import { BookRecordTableInterface } from "../../../Model/BookTableModel";

import { TransferDateToISOString } from "../../../Controller/OtherController";
import { setDataTextColor, setLoanBookDataTextColor } from "../../../Controller/SetTextController";

import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface SelfLoanRecordTableCellInterface
{
    paginatedData: LoanBookInterface[];
    TableName: tableNameType;
    paginationPageVariable : { paginationValue: number; page: number };
}

const SelfLoanBookTableCell = (propsData: SelfLoanRecordTableCellInterface) =>
{
    const {paginatedData, TableName, paginationPageVariable} = propsData;
    
    return (
        paginatedData.map((data, index) => 
        (
            <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                <TableCell sx={{"&:hover": {cursor: "pointer"}}}>{(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}</TableCell>
                
                <ContentTableCell TableName={TableName} value={1} Information={data}>
                    <Avatar src={data.bookDetails?.image?.url} alt="Preview" variant="rounded" sx={{ width: "150px", height: "225px" }}/>
                </ContentTableCell>

                <ContentTableCell TableName={TableName} value={1} Information={data}>{data.bookDetails?.bookname}</ContentTableCell>

                <ContentTableCell TableName={TableName} value={1} Information={data}>{TransferDateToISOString(data.loanDate as Date)}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={1} Information={data}>{TransferDateToISOString(data.dueDate as Date)}</ContentTableCell>
                <ContentTableCell TableName={TableName} value={1} Information={data} textColor={setLoanBookDataTextColor(data.status as string)}>{data.status}</ContentTableCell>

                <ContentTableCell TableName={TableName} value={1} Information={data}>
                    {data.returnDate === null ? "N/A" : TransferDateToISOString(data.returnDate as Date)}
                </ContentTableCell>

                <ContentTableCell TableName={TableName} value={1} Information={data} textColor={setDataTextColor(data.finesPaid as string, "Not Paid", "red", "green")}>
                    { data.fineAmount !== 0 && data.finesPaid !== "Not Fine Needed" ? "Not Paid" : data.finesPaid }
                </ContentTableCell>
                
                <ContentTableCell TableName={TableName} value={1} Information={data}>
                    HKD$ { data.fineAmount }
                </ContentTableCell>
            </TableRow>
        ))
    )
}

const SelfLoanBookTable:FC<BookRecordTableInterface> = (DataForAllUserTable) => 
{
    const { value, bookData, paginationValue } = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<LoanBookInterface>(bookData[value] as LoanBookInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Book";
    
    return(
        <Fragment>
            <Table>

                <TableHead>
                    <TableRow>
                        {SelfLoanBookTableHeader.map((header, index) =>
                            (
                                <TableCell key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        SelfLoanBookTableCell({paginatedData, TableName, paginationPageVariable})
                    }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default SelfLoanBookTable