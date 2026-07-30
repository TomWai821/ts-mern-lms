import { FC, Fragment } from "react";
import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment
import ContentTableCell from "../../../../UIFragment/ContentTableCell";
import ActionTableCell from "../../../../Manager/ActionTableCellManager";

// Models
import { ContactTableInterface } from "../../../../../Model/BookTableModel";
import { AuthorTableHeader } from "../../../../../Data/TableData";
import { ItemToCenter } from "../../../../../Data/Style";
import { ContactInterface } from "../../../../../Model/ResultModel";
import { usePaginationService } from "../../../../../services/pages/paginationService";

interface AuthorTableCellInterface
{
    value: number;
    paginatedData: ContactInterface[];
    TableName: string;
    paginationPageVariable : { paginationValue: number; page: number };
}


const AuthorTableCell = (propsData: AuthorTableCellInterface) => 
{
    const {value, paginatedData, TableName, paginationPageVariable} = propsData;

    return(
        paginatedData.map((data, index) => 
            (
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{"&:hover": {cursor: "pointer"}}}>
                        {(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}
                    </TableCell>
                    
                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.author}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.email}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value as number} Information={data}>{data.phoneNumber}</ContentTableCell>
                    <ActionTableCell TableName={TableName} value={value as number} Information={data} />
                </TableRow>
            )
        )
    )
}

const AuthorTable:FC<ContactTableInterface> = (DataForAllUserTable) => 
{
    const { value, contactData, paginationValue} = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<ContactInterface>(contactData[value] as ContactInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "Contact";
    
    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {AuthorTableHeader.map((header, index) =>
                            (
                                <TableCell sx={{fontSize: '16px'}} key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        AuthorTableCell({value: value as number, paginatedData, TableName, paginationPageVariable})
                    }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default AuthorTable
