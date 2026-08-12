import { Box, Divider } from "@mui/material";
import { useBookContext } from "../../../../Context/Book/BookContext";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import { BookDataInterface, LoanBookInterface } from "../../../../Model/ResultModel";
import DashboardCard from "../../../UIFragment/DashboardCard";
import FinesDataPieChart from "./Piechart/FinesDataPieChart";

const OverdueBookHelper = (loanBookRecords: LoanBookInterface[]) => 
{
    const notPaid = loanBookRecords.filter((record) => record.finesPaid === "Not Paid");
    const paid = loanBookRecords.filter((record) => record.finesPaid === "Paid");

    const NotPaidTotal = notPaid.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);
    const PaidTotal = paid.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);

    const NotPaidCount = notPaid.length;
    const PaidCount = paid.length;

    const totalAmount = NotPaidTotal + PaidTotal;

    return { NotPaidTotal, PaidTotal, NotPaidCount, PaidCount, totalAmount };
};

const useFinanceData = (bookData: (LoanBookInterface[] | BookDataInterface[])[]) => 
{
    const FinanceCardData = 
    [
        { title: "Paid Records", recordAmount: OverdueBookHelper(bookData[1] as LoanBookInterface[]).PaidCount },
        { title: "Not Paid Records", recordAmount: OverdueBookHelper(bookData[1] as LoanBookInterface[]).NotPaidCount },
        { title: "Total Fines Amount (HKD$)", recordAmount: OverdueBookHelper(bookData[1] as LoanBookInterface[]).totalAmount}
    ];

    return {FinanceCardData};
}

const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const FinanceDashboard = () => 
{
    const {bookData} = useBookContext();
    const {FinanceCardData} = useFinanceData(bookData);

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
            <Box sx={ItemToCenter}>
                <FinesDataPieChart 
                    PaidFines={OverdueBookHelper(bookData[1] as LoanBookInterface[]).PaidTotal} 
                    NotPaidFines={OverdueBookHelper(bookData[1] as LoanBookInterface[]).NotPaidTotal}
                />
            </Box>
            
        </Box>
    )
}

export default FinanceDashboard