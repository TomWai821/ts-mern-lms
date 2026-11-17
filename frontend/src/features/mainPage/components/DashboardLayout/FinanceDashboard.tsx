import { Box, Divider } from "@mui/material";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import DashboardCard from "../../../../component/UIFragment/DashboardCard";
import FinesDataPieChart from "./Piechart/FinesDataPieChart";
import FinesNotPaidDataPieChart from "./Piechart/FinesNotPaidDataPieChart";
import { FinesDashboardData } from "../../../../services/contents/dashboardService";
import { FC } from "react";
import InsightCard from "../../../../component/UIFragment/InsightCard";


interface BookDashboardProps
{
    dashboardData: {data: FinesDashboardData, insight: string[]};
}

const useFinanceData = (dashboardData: FinesDashboardData) => 
{
    const FinanceCardData = 
    [
        { title: "Paid Records", recordAmount: dashboardData.FinesPaidCount ?? 0 },
        { title: "Not Paid Records", recordAmount: dashboardData.FinesPaidCount ?? 0 },
        { title: "Total Fines Amount (HKD$)", recordAmount: dashboardData.TotalFinesAmount ?? 0 }
    ];

    return {FinanceCardData};
}

const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const FinanceDashboard:FC<BookDashboardProps> = (props) => 
{
    const { dashboardData } = props;
    const { FinanceCardData } = useFinanceData(dashboardData.data);

    return(
        <Box sx={CardSectionSyntax}>
            <Box sx={CardContentDisplaySyntax}>
                {
                    FinanceCardData.map(item =>
                    (
                        <DashboardCard key={item.title} title={item.title} recordAmount={item.recordAmount} />
                    ))
                }
             </Box>

            <Divider/>

            <Box sx={{...ItemToCenter, paddingBottom: "50px"}}>
                <FinesDataPieChart 
                    PaidFines={dashboardData.data.FinesDetails["Paid"]} 
                    NotPaidFines={dashboardData.data.FinesDetails["Not Paid"]}
                />

                <FinesNotPaidDataPieChart 
                    ReturnBook={dashboardData.data.NotPaidFinesRecordDetails["Return Book"]} 
                    NotReturnBook={dashboardData.data.NotPaidFinesRecordDetails["Not Return Book"]}
                />
            </Box>
            
            <Divider/>

            <InsightCard content={ dashboardData.insight }/>
        </Box>
    )
}

export default FinanceDashboard