import { FC } from "react";
import { Fragment } from "react/jsx-runtime";
import CustomTabPanel from "../../../UIFragment/CustomTabPanel";
import UserDashboard from "../../MainPages/Dashboard/UserDashboard";
import FinanceDashboard from "../../MainPages/Dashboard/FinanceDashboard";
import BookDashboard from "../../MainPages/Dashboard/BookDashboard";

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
            {
                DashboardComponent.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={tabValue}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Fragment>
    )
}

export default DashboardTabPanel