import { FC, Fragment } from "react";

import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment and Manager
import ContentTableCell from "../../../../UIFragment/ContentTableCell";
import ActionTableCell from "../../../../Manager/ActionTableCellManager";

// Model
import { UserDataTableInterface } from "../../../../../Model/UserTableModel";

// Data (CSS Syntax and table header)
import { ItemToCenter } from "../../../../../Data/Style";
import { SuspendUserTableHeader } from "../../../../../Data/TableData";

import { CalculateDuration, TransferDateToString } from "../../../../../Controller/OtherController";
import { useAuthContext } from "../../../../../Context/User/AuthContext";
import { setDataTextColor } from "../../../../../Controller/SetTextController";
import { UserResultDataInterface } from "../../../../../Model/ResultModel";

import { usePaginationService } from "../../../../../services/pages/paginationService";

interface SuspendUserTableCellInterface
{
    paginatedData: UserResultDataInterface[];
    TableName: string;
    value: number;
    paginationPageVariable : { paginationValue: number; page: number };
}

const SuspendUserTableCell = (propsData: SuspendUserTableCellInterface) => 
{
    const { paginatedData, TableName, value, paginationPageVariable } = propsData;
    const { IsAdmin } = useAuthContext();

    return(
        paginatedData.map((data, index) => 
        {
            return(
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{fontSize: "16px", "&:hover": {cursor: "pointer"}}}>
                        {(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}
                    </TableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}> {data.username} </ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}> {data.role} </ContentTableCell>
                    
                    <ContentTableCell TableName={TableName} value={value} Information={data} textColor={setDataTextColor(data.suspendedDetails?.status as string, "Unsuspend", "green", "red")}>
                        {data.suspendedDetails?.status} 
                    </ContentTableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}> {TransferDateToString(data.suspendedDetails?.startDate as Date)} </ContentTableCell>
                    
                    <ContentTableCell TableName={TableName} value={value} Information={data}> 
                        {CalculateDuration(data.suspendedDetails?.startDate as Date, data.suspendedDetails?.dueDate as Date)}
                    </ContentTableCell>
                    
                    {IsAdmin() && (<ActionTableCell value={value} TableName={TableName} Information={data}/>)}
                </TableRow>
            )
        })
    )
}

const SuspendUserTable:FC<UserDataTableInterface> = (DataForSuspendedUserTable) => 
{
    const {value, userData, paginationValue} = DataForSuspendedUserTable;
    const { IsAdmin } = useAuthContext();

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<UserResultDataInterface>(userData[value], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "User";

    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {SuspendUserTableHeader.map((header, index) =>
                            (
                                (header.isAdmin && !IsAdmin()) ? null : <TableCell key={index} sx={{fontSize: '16px'}}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    { 
                        SuspendUserTableCell({paginatedData, TableName, value, paginationPageVariable})
                    }
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default SuspendUserTable
