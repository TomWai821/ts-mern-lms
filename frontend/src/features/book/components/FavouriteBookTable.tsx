import { Avatar, Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ItemToCenter } from "../../../Data/Style";
import { FC, Fragment } from "react";
import { AllBookTableHeader } from "../../../Data/TableData";
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";
import { LoanBookInterface } from "../../../Model/ResultModel";
import { BookRecordTableInterface } from "../../../Model/BookTableModel";
import RecordBookTableCell from "../../selfRecords/components/SelfRecordBookTableCell";
import { setDataTextColor } from "../../../Controller/SetTextController";

import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface FavouriteTableCellInterface
{
    paginatedData: LoanBookInterface[];
    TableName: tableNameType;
    value: number;
    paginationPageVariable : { paginationValue: number; page: number };
}

const FavouriteBookTableCell = (propsData: FavouriteTableCellInterface) => 
{
    const {paginatedData, TableName, value, paginationPageVariable} = propsData;

    return(
        paginatedData.map((data, index) => 
            (
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{"&:hover": {cursor: "pointer"}}}>{(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}</TableCell>
                    
                    <ContentTableCell TableName={TableName} value={value} Information={data}>
                        <Avatar src={data.bookDetails?.image?.url} alt="Preview" variant="rounded" sx={{ width: "150px", height: "225px" }}/>
                    </ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data}>{data.bookDetails?.bookname}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data}>{data.genreDetails?.genre}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data}>{data.languageDetails?.language}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data}>{data.authorDetails?.author}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data}>{data.publisherDetails?.publisher}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={0} Information={data} textColor={setDataTextColor(data.bookDetails?.status as string, "OnShelf", "green", "red")}>{data.bookDetails?.status}</ContentTableCell>
                    <RecordBookTableCell value={value} Information={data}/>
                </TableRow>
            )
        )
    )
}

const FavouriteBookTable:FC<BookRecordTableInterface> = (DataForAllUserTable) => 
{
    const {value, bookData, paginationValue} = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<LoanBookInterface>(bookData[value] as LoanBookInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Book";

    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {AllBookTableHeader.map((header, index) =>
                            (
                                <TableCell key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        FavouriteBookTableCell({paginatedData, TableName, value, paginationPageVariable})
                    }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default FavouriteBookTable