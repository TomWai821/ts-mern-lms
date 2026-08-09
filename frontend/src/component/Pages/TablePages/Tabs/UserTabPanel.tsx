import { FC, Fragment } from "react"

// Tabs
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// Another Component
import AllUserTable from "../Tables/User/AllUserTable"
import SuspendedUserTable from "../Tables/User/SuspendUserTable"

// Model
import { UserDataTableInterface } from "../../../../Model/UserTableModel"

const UserTabPanel:FC<UserDataTableInterface> = (userTableData) =>
{
    const {value, userData, paginationValue, changeValue, setSearchUserData, searchUserData} = userTableData

    const UserRecordTables = 
    [
        <AllUserTable userData={userData} value={value} paginationValue={paginationValue} changeValue={changeValue} setSearchUserData={setSearchUserData} searchUserData={searchUserData}/>, 
        <SuspendedUserTable userData={userData} value={value} paginationValue={paginationValue}/>
    ];

    return(
        <Fragment>
            {
                UserRecordTables.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Fragment>
    )
}

export default UserTabPanel