import { Box, Divider } from "@mui/material";
import { useBookContext } from "../../../../Context/Book/BookContext";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import { BookDataInterface, LoanBookInterface } from "../../../../Model/ResultModel";
import DashboardCard from "../../../UIFragment/DashboardCard";
import FinesDataPieChart from "./Piechart/FinesDataPieChart";
import FinesNotPaidDataPieChart from "./Piechart/FinesNotPaidDataChart";

const OverdueBookHelper = (loanBookRecords: LoanBookInterface[]) => 
{
    const notPaid = loanBookRecords.filter((record) => record.finesPaid === "Not Paid");
    const paid = loanBookRecords.filter((record) => record.finesPaid === "Paid");

    const NotPaidTotal = notPaid.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);
    const PaidTotal = paid.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);

    const NotPaidCount = notPaid.length;
    const PaidCount = paid.length;

    const totalAmount = NotPaidTotal + PaidTotal;

    return { notPaid, NotPaidTotal, PaidTotal, NotPaidCount, PaidCount, totalAmount };
};

const FinesNotPaidHelper = (notPaidData: LoanBookInterface[]) => 
{
    const returnBook = notPaidData.filter(data => data.status === "Return(Late)");
    const notReturnBook = notPaidData.filter(data => data.status === "Loaned");

    const returnBookTotal = returnBook.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);
    const notReturnBookTotal = notReturnBook.reduce((sum, record) => sum + (record.fineAmount ?? 0), 0);

    return {returnBookTotal, notReturnBookTotal};
}

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
    const {returnBookTotal, notReturnBookTotal} = FinesNotPaidHelper(OverdueBookHelper(bookData[1] as LoanBookInterface[]).notPaid);

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

                <FinesNotPaidDataPieChart 
                    ReturnBook={returnBookTotal} 
                    NotReturnBook={notReturnBookTotal}
                />
            </Box>
            
        </Box>
    )
}

export default FinanceDashboard