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
    dashboardData: BookDashboardData;
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
    const {BookCardData} = useBookData(dashboardData);

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

            <Box sx={{...ItemToCenter, addingBottom: "50px"}}>
                <LoanBookPieChart 
                    loanedCount={ dashboardData.LoanedStatusCount["Loaned"] } 
                    returnCount={ dashboardData.LoanedStatusCount["Returned"] } 
                    lateReturnCount={ dashboardData.LoanedStatusCount["Returned(Late)"] }
                />

                <BookGenrePieChart Genre={dashboardData.AllBooksGenresCount}/>

                <LoanBookGenrePieChart Genre={dashboardData.BookLoanedGenresCount}/>
            </Box>

            <Divider/>
            
            {dashboardData.insight && dashboardData.insight.length > 0 && <InsightCard content={ dashboardData.insight }/>}
        </Box>
    )
}

export default BookDashboard