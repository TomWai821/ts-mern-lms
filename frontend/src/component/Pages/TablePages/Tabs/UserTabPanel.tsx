import { FC, Fragment, lazy, Suspense } from "react"

// Tabs
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

// Model
import { UserDataTableInterface } from "../../../../Model/UserTableModel"

const AllUserTable = lazy(() => import("../Tables/User/AllUserTable"));
const SuspendedUserTable = lazy(() => import("../Tables/User/SuspendUserTable"));

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
            <Suspense fallback={<div>Loading...</div>}>
            {
                UserRecordTables.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={value}>
                        {table}
                    </CustomTabPanel>
                ))
            }
            </Suspense>
        </Fragment>
    )
}

export default UserTabPanel