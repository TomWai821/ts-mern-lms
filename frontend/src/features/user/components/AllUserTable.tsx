import { FC, Fragment } from "react";
import { Pagination, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

// UI Fragment
import ContentTableCell from "../../../component/UIFragment/ContentTableCell";
import ActionTableCell from "../../shared/mangers/ActionTableCellManager";

// Models
import { UserDataTableInterface } from "../../../Model/UserTableModel";

// Data (CSS Syntax and table header)
import { ItemToCenter } from "../../../Data/Style";
import { AllUserTableHeader } from "../../../Data/TableData";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { setDataTextColor } from "../../../Controller/SetTextController";

import { UserResultDataInterface } from "../../../Model/ResultModel";

import { usePaginationService } from "../../../services/pages/paginationService";
import { tableNameType } from "../../shared/configs/ActionTableCellForAdmin";

interface AllUserTableCellInterface
{
    paginatedData: UserResultDataInterface[];
    TableName: tableNameType;
    value: number;
    changeValue: ((type: string, newValue: number) => void) | undefined;
    setSearchUserData: ((data: { username: string; role: string; status: string; gender: string; }) => void) | undefined;
    searchUserData: { username: string; role: string; status: string; gender: string; } | undefined;
    paginationPageVariable : { paginationValue: number; page: number };
}

const AllUserTableCell = (propsData: AllUserTableCellInterface) =>
{
    const { paginatedData, TableName, value, changeValue, setSearchUserData, searchUserData, paginationPageVariable } = propsData;
    const { isAdmin } = useAuthContext();

    return(
        paginatedData.map((data, index) => 
            (
                <TableRow key={index} sx={{"&:hover": {backgroundColor: "rgb(230, 230, 230)"}}}>
                    <TableCell sx={{"&:hover": {cursor: "pointer"}}}>
                        {(paginationPageVariable.paginationValue * (paginationPageVariable.page - 1)) + index + 1}
                    </TableCell>

                    <ContentTableCell TableName={TableName} value={value} Information={data}>{data.username}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}>{data.role}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data} textColor={setDataTextColor(data.status, "Normal", "green", "red")}>{data.status}</ContentTableCell>
                    <ContentTableCell TableName={TableName} value={value} Information={data}>{data.gender}</ContentTableCell>
                    {isAdmin && 
                        (
                            <ActionTableCell value={value} TableName={TableName} Information={data} changeValue={changeValue as (type: string, newValue: number) => void} 
                                setSearchUserData={setSearchUserData} searchUserData={searchUserData}/>
                        )
                    }
                </TableRow>
            )
        )
    )
}


const AllUserTable:FC<UserDataTableInterface> = (DataForAllUserTable) => 
{
    const {value, userData, paginationValue, changeValue, setSearchUserData, searchUserData} = DataForAllUserTable;

    const { paginatedData, getCountPage, handlePageChange, page } = usePaginationService<UserResultDataInterface>(userData[value] as UserResultDataInterface[], paginationValue);
    const paginationPageVariable = {paginationValue, page};
    const TableName = "User";
    
    return(
        <Fragment>
            <Table sx={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                    <TableRow>
                        {AllUserTableHeader.map((header, index) =>
                            (
                                <TableCell sx={{fontSize: '16px'}} key={index}>{header.label}</TableCell>
                            ) 
                        )}  
                    </TableRow>
                </TableHead>

                <TableBody>
                    {AllUserTableCell({paginatedData, TableName, value: value as number, changeValue, setSearchUserData, searchUserData, paginationPageVariable})}
                </TableBody>
            </Table>

            <Pagination sx={{ ...ItemToCenter, alignItems: "center", paddingTop: "10px" }} count={getCountPage() as number} page={page} onChange={handlePageChange}/>
        </Fragment>
    );
}

export default AllUserTable
