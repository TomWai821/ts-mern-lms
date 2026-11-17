import { Box, Divider } from "@mui/material";
import DashboardCard from "../../../../component/UIFragment/DashboardCard";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import SuspendListDataPieChart from "./Piechart/SuspendListDataPieChart";
import { UserDashboardData } from "../../../../services/contents/dashboardService";
import { FC } from "react";
import InsightCard from "../../../../component/UIFragment/InsightCard";

interface UserDashboardProps
{
    dashboardData: {data: UserDashboardData, insight: string[]};
}

const useUserData = (dashboardData: UserDashboardData) => 
{
    const UserCardData = 
    [
        { title: "Register Users", recordAmount: dashboardData.UserCount ?? 0 },
        { title: "Current Suspended Users", recordAmount: dashboardData.UserCurrentlySuspendCount ?? 0 },
    ];

    return {UserCardData};
}

const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const UserDashboard:FC<UserDashboardProps> = (props) => 
{
    const {dashboardData} = props;
    const {UserCardData} = useUserData(dashboardData.data);
    
        return(
            <Box sx={CardSectionSyntax}>
                <Box sx={CardContentDisplaySyntax}>
                    {
                        UserCardData.map(item =>
                        (
                            <DashboardCard key={item.title}  title={item.title} recordAmount={item.recordAmount} />
                        ))
                    }
                </Box>

                <Divider/>

                <Box sx={{...ItemToCenter, paddingBottom: "50px"}}>
                    <SuspendListDataPieChart 
                        suspendUser={dashboardData.data.SuspendListSuspendUserCount} 
                        UnsuspendUser={dashboardData.data.SuspendListUnsuspendUserCount}
                    />
                </Box>

                <Divider/>

                <InsightCard content={ dashboardData.insight }/>
            </Box>
        )
}

export default UserDashboard