import { FC, Fragment } from "react";

import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment and Manager
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";
import ActionTableCell from "../../shared/mangers/ActionTableCellManager";

// Model
import { UserDataTableInterface } from "../../../Model/UserTableModel";

// Data (CSS Syntax and table header)
import { ItemToCenter } from "../../../Data/Style";
import { SuspendUserTableHeader } from "../../../Data/TableData";

import { CalculateSuspendDuration, getRemainingSuspensionDays, TransferDateToString } from "../../../Controller/OtherController";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { setDataTextColor } from "../../../Controller/SetTextController";
import { UserResultDataInterface } from "../../../Model/ResultModel";

import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface SuspendUserTableCellInterface
{
    paginatedData: UserResultDataInterface[];
    TableName: tableNameType;
    value: number;
    paginationPageVariable : { paginationValue: number; page: number };
}

const SuspendUserTableCell = (propsData: SuspendUserTableCellInterface) => 
{
    const { paginatedData, TableName, value, paginationPageVariable } = propsData;
    const { isAdmin } = useAuthContext();


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

                    <ContentTableCell TableName={TableName} value={value} Information={data}> 
                        {TransferDateToString(data.suspendedDetails?.startDate as Date)} 
                    </ContentTableCell>
                                            

                    <ContentTableCell TableName={TableName} value={value} Information={data}>
                        {CalculateSuspendDuration(data.suspendedDetails?.startDate as Date, data.suspendedDetails?.dueDate as Date)} 
                    </ContentTableCell>
                    
                    {isAdmin &&
                        (
                            <>
                                <ContentTableCell TableName={TableName} value={value} Information={data}> 
                                    {
                                        data.status === "Suspend" && data.suspendedDetails?.dueDate 
                                        ? 
                                        `${getRemainingSuspensionDays(data.suspendedDetails?.dueDate as Date)}`
                                        : 
                                        "-"
                                    }
                                </ContentTableCell>

                                <ActionTableCell value={value} TableName={TableName} Information={data}/>
                            </>
                        )
                    }
                </TableRow>
            )
        })
    )
}

const SuspendUserTable:FC<UserDataTableInterface> = (DataForSuspendedUserTable) => 
{
    const {value, userData, paginationValue} = DataForSuspendedUserTable;
    const { isAdmin } = useAuthContext();

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<UserResultDataInterface>(userData[value] as UserResultDataInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "User";

    return(
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        {SuspendUserTableHeader.map((header, index) =>
                            (
                                (header.isAdmin && !isAdmin) ? null : <TableCell key={index} sx={{fontSize: '16px'}}>{header.label}</TableCell>
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
