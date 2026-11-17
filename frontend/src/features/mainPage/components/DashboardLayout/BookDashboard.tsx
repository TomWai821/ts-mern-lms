import { Box, Divider } from "@mui/material";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import DashboardCard from "../../../../component/UIFragment/DashboardCard";
import LoanBookPieChart from "./Piechart/LoanBookPieChart";
import BookGenrePieChart from "./Piechart/BookGenrePieChart";
import LoanBookGenrePieChart from "./Piechart/LoanBookGenrePieChart";
import { BookDashboardData } from "../../../../services/contents/dashboardService";
import { FC } from "react";
import InsightCard from "../../../../component/UIFragment/InsightCard";


interface BookDashboardProps
{
    dashboardData: {data: BookDashboardData, insight: string[]};
}

const useBookData = (dashboardData: BookDashboardData) => 
{
    const BookCardData = 
    [
        { title: "Books", recordAmount: dashboardData.BooksCount ?? 0 },
        { title: "Loaned Records", recordAmount: dashboardData.BookLoanedCount ?? 0 }
    ];

    return {BookCardData};
}

const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const BookDashboard:FC<BookDashboardProps> = (props) =>
{
    const { dashboardData } = props;
    const {BookCardData} = useBookData(dashboardData.data);

    return(
        <Box sx={CardSectionSyntax}>
            <Box sx={CardContentDisplaySyntax}>
                {
                    BookCardData.map(item =>
                    (
                        <DashboardCard key={item.title}  title={item.title} recordAmount={item.recordAmount} />
                    ))
                }
            </Box>

            <Divider/>

            <Box sx={{...ItemToCenter, paddingBottom: "50px"}}>
                <LoanBookPieChart 
                    loanedCount={ dashboardData.data.LoanedStatusCount["Loaned"] } 
                    returnCount={ dashboardData.data.LoanedStatusCount["Returned"] } 
                    lateReturnCount={ dashboardData.data.LoanedStatusCount["Returned(Late)"] }
                />

                <BookGenrePieChart Genre={dashboardData.data.AllBooksGenresCount}/>

                <LoanBookGenrePieChart Genre={dashboardData.data.BookLoanedGenresCount}/>
            </Box>

            <Divider/>
            
            <InsightCard content={ dashboardData.insight }/>
        </Box>
    )
}

export default BookDashboard