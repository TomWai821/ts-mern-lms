import { Box} from "@mui/material";
import { usePageService } from "../../../services/pages/pageService";
import DashboardTabPanel from "../components/Tabs/DashboardTabPanel";
import CustomTab from "../../../component/UIFragment/CustomTab";
import { useEffect, useState } from "react";
import { BookDashboardData, FinesDashboardData, GetDashboardData, UserDashboardData } from "../../../services/contents/dashboardService";
import { useAuthContext } from "../../../Context/User/AuthContext";

export interface IDashboardData
{
    usersData: {data: UserDashboardData, insight: string[]};
    booksData: {data: BookDashboardData, insight: string[]};
    finesData: {data: FinesDashboardData, insight: string[]};
}

const DashboardPage = () => 
{
    const { tabValue, changeValue } = usePageService();
    const { isAdmin, isAuthLoading } = useAuthContext();
    const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);

    const tabLabel = 
    [
        {label: "User Section"},
        {label: "Book Section"},
        {label: "Fine Records Section"}
    ];

    useEffect(() => 
    {
        const initDashboard = async () =>
        {
            const result = await GetDashboardData();
            setDashboardData(result);
        };

        if (isAuthLoading) return;
        if (!isAdmin) return;

        void initDashboard();
    },[isAuthLoading, isAdmin])

    return(
        dashboardData !== null && 
        <Box>
            <CustomTab value={tabValue} changeValue={changeValue} tabLabel={tabLabel} type={""}/>
            
            <DashboardTabPanel tabValue={tabValue} dashboardData={dashboardData}/>
        </Box>
    )
}

export default DashboardPage