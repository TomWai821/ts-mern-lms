import { FC, lazy, Suspense } from "react";
import { Fragment } from "react/jsx-runtime";

import CustomTabPanel from "../../../../component/UIFragment/CustomTabPanel";
import { BookDashboardData, FinesDashboardData, UserDashboardData } from "../../../../services/contents/dashboardService";
import { IDashboardData } from "../../pages/DashboardPage";

const UserDashboard = lazy(() => import("../DashboardLayout/UserDashboard"));
const FinanceDashboard = lazy(() => import("../DashboardLayout/FinanceDashboard"));
const BookDashboard = lazy(() => import("../DashboardLayout/BookDashboard"));

interface PropsInterface
{
    tabValue: number;
    dashboardData: IDashboardData | null;
}

const DashboardTabPanel:FC<PropsInterface> = (props) =>
{
    const {tabValue, dashboardData} = props;

    const DashboardComponent = 
    [
        <UserDashboard dashboardData={dashboardData?.usersData as UserDashboardData}/>,
        <BookDashboard dashboardData={dashboardData?.booksData as BookDashboardData}/>,
        <FinanceDashboard dashboardData={dashboardData?.finesData as FinesDashboardData}/>
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