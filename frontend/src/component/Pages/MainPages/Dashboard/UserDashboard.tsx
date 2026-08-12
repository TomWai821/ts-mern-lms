import { Box, Divider } from "@mui/material";
import { useUserContext } from "../../../../Context/User/UserContext";
import { DetailsInterfaceForSuspend, UserResultDataInterface } from "../../../../Model/ResultModel";
import DashboardCard from "../../../UIFragment/DashboardCard";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import SuspendListDataPieChart from "./Piechart/SuspendListDataPieChart";

const useUserData = (userData: (UserResultDataInterface[] | DetailsInterfaceForSuspend[])[]) => 
{
    const UserCardData = 
    [
        { title: "Register User", recordAmount: userData[0].length },
        { title: "Suspend Records", recordAmount: userData[1].length },
    ];

    return {UserCardData};
}

const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const UserDashboard = () => 
{
    const {userData} = useUserContext();
    const {UserCardData} = useUserData(userData);
    
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
                <Box sx={ItemToCenter}>
                    <SuspendListDataPieChart 
                        suspendUser={userData[1].filter((suspendRecord) => (suspendRecord as UserResultDataInterface).suspendedDetails?.status === "Suspend").length} 
                        UnsuspendUser={userData[1].filter((suspendRecord) => (suspendRecord as UserResultDataInterface).suspendedDetails?.status === "Unsuspend").length}
                    />
                </Box>
            </Box>
        )
}

export default UserDashboard