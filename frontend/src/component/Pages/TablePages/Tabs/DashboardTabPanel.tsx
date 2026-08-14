import { FC, lazy, Suspense } from "react";
import { Fragment } from "react/jsx-runtime";

import CustomTabPanel from "../../../UIFragment/CustomTabPanel";

const UserDashboard = lazy(() => import("../../MainPages/Dashboard/UserDashboard"));
const FinanceDashboard = lazy(() => import("../../MainPages/Dashboard/FinanceDashboard"));
const BookDashboard = lazy(() => import("../../MainPages/Dashboard/BookDashboard"));

interface PropsInterface
{
    tabValue: number
}

const DashboardTabPanel:FC<PropsInterface> = (props) =>
{
    const {tabValue} = props;

    const DashboardComponent = 
    [
        <UserDashboard/>,
        <BookDashboard/>,
        <FinanceDashboard/>
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