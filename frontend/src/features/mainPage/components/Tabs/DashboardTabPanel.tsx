import { FC, lazy, Suspense } from "react";
import { Fragment } from "react/jsx-runtime";

import CustomTabPanel from "../../../../component/UIFragment/CustomTabPanel";
import type { IDashboardData } from "../../pages/DashboardPage";

const UserDashboard = lazy(() => import("../DashboardLayout/UserDashboard"));
const FinanceDashboard = lazy(() => import("../DashboardLayout/FinanceDashboard"));
const BookDashboard = lazy(() => import("../DashboardLayout/BookDashboard"));

interface PropsInterface
{
    tabValue: number;
    dashboardData: IDashboardData;
}

const DashboardTabPanel:FC<PropsInterface> = (props) =>
{
    const {tabValue, dashboardData} = props;

    const DashboardComponent = 
    [
        <UserDashboard key="users" dashboardData={dashboardData.usersData}/>,
        <BookDashboard key="books" dashboardData={dashboardData.booksData}/>,
        <FinanceDashboard key="finance" dashboardData={dashboardData.finesData}/>
    ];
    
    return(
        <Fragment>
            <Suspense fallback={<div>Loading...</div>}>
            {
                DashboardComponent.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={tabValue}>
                        {table}
                    </CustomTabPanel>
                ))
            }
            </Suspense>
        </Fragment>
    )
}

export default DashboardTabPanel