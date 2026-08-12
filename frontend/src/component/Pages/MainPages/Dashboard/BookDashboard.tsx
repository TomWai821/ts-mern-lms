import { Box, Divider } from "@mui/material";
import { useBookContext } from "../../../../Context/Book/BookContext";
import { displayAsColumn, displayAsRow, ItemToCenter } from "../../../../Data/Style";
import { LoanBookInterface, BookDataInterface } from "../../../../Model/ResultModel";
import DashboardCard from "../../../UIFragment/DashboardCard";
import LoanBookPieChart from "./Piechart/LoanBookPieChart";
import BookGenrePieChart from "./Piechart/BookGenrePieChart";
import LoanBookGenrePieChart from "./Piechart/LoanBookGenrePieChart";


type bookStatus = "Returned(Late)" | "Loaned" | "Returned";

const OverdueBookHelper = (loanBookRecords: LoanBookInterface[], status: bookStatus) => 
{
    return loanBookRecords.filter((record) => record.status === status).length;
};

const useBookData = (bookData: (LoanBookInterface[] | BookDataInterface[])[]) => 
{
    const BookCardData = 
    [
        { title: "Books", recordAmount: bookData[0].length },
        { title: "Loaned Records", recordAmount: bookData[1].length }
    ];

    return {BookCardData};
}

const countGenre = (bookData: (LoanBookInterface | BookDataInterface)[]) =>
{
    const genreCount = bookData.reduce((acc, book) => 
    {
        const genre = (book as BookDataInterface).genre || (book as LoanBookInterface).genreDetails.genre;

        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return genreCount;
};


const CardSectionSyntax = { ...displayAsColumn, padding: "50px 20px", width: '100%' };
const CardContentDisplaySyntax = { ...displayAsRow, gap: '15px 30px', gridTemplateColumns: 'repeat(3, 25%)', paddingBottom: "50px", justifyContent: 'center' };

const BookDashboard = () =>
{
    const {bookData} = useBookContext();
    const {BookCardData} = useBookData(bookData);

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
            <Box sx={ItemToCenter}>
                <LoanBookPieChart 
                    loanedCount={ OverdueBookHelper(bookData[1] as LoanBookInterface[], "Loaned") } 
                    returnCount={ OverdueBookHelper(bookData[1] as LoanBookInterface[], "Returned")} 
                    lateReturnCount={ OverdueBookHelper(bookData[1] as LoanBookInterface[], "Returned(Late)") }
                />

                <BookGenrePieChart Genre={countGenre(bookData[0])}/>

                <LoanBookGenrePieChart Genre={countGenre(bookData[1])}/>
            </Box>
        </Box>
    )
}

export default BookDashboard