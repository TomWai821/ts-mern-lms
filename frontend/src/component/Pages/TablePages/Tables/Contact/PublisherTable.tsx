import { FC, Fragment } from "react";
import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment
import ContentTableCell from "../../../../UIFragment/ContentTableCell";
import ActionTableCell from "../../../../Manager/ActionTableCellManager";

// Models
import { ContactTableInterface } from "../../../../../Model/BookTableModel";
import { PublisherTableHeader } from "../../../../../Data/TableData";
import { ItemToCenter } from "../../../../../Data/Style";
import { ContactInterface } from "../../../../../Model/ResultModel";
import { usePaginationService } from "../../../../../services/pages/paginationService";

interface PublisherTableCellInterface
{
    value: number;
    paginatedData: ContactInterface[];
    TableName: string;
    paginationPageVariable : { paginationValue: number; page: number };
}

const PublisherTableCell = (propsData: PublisherTableCellInterface) => 
{
    const { value, paginatedData, TableName, paginationPageVariable } = propsData;

    return(
        paginatedData.map((data, index) => 
            (
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{fontSize: "16px", "&:hover": {cursor: "pointer"}}}>
                        {(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}
                    </TableCell>

                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.publisher}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.email}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.phoneNumber}</ContentTableCell>
                    <ActionTableCell value={value as number} TableName={TableName} Information={data}/>
                </TableRow>
            )
        )
    )
}

const PublisherTable:FC<ContactTableInterface> = (DataForAllUserTable) => 
{
    const { value, contactData, paginationValue } = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<ContactInterface>(contactData[value] as ContactInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Contact";
    
    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {PublisherTableHeader.map((header, index) =>
                            (
                                <TableCell sx={{fontSize: '16px'}} key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {PublisherTableCell({value: value as number, paginatedData, TableName, paginationPageVariable})}
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default PublisherTable
