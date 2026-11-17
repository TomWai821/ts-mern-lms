import { GetBookCount, GetBook, AllBooksAggregationResult } from "../../schema/book/book";
import { GetBookLoanedCount, GetBookLoaned, BookLoanedAggregationResult, BookReturnStatus } from "../../schema/book/bookLoaned";
import { PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";

export interface BookDashboardData
{
    BooksCount: number | undefined;
    BookLoanedCount: number | undefined;
    LoanedStatusCount: Record<"Returned" | "Loaned" | "Returned(Late)", number>;
    AllBooksGenresCount: Record<string, number>;
    BookLoanedGenresCount: Record<string, number>;
}

export const bookDashboardDTO = async () =>
{
    const [BooksCount, BookLoanedCount, AllLoanBooks, AllBooks ] = await Promise.all(
        [GetBookCount(), GetBookLoanedCount(), GetBookLoaned(), GetBook()]
    );

    const loanedBooks = AllLoanBooks as BookLoanedAggregationResult[];

    const LoanedStatusCount: Record<BookReturnStatus, number> = loanedBooks.reduce((prev, curr) => 
        { 
            prev[curr.status as BookReturnStatus]++; 
            return prev; 
        },
        { "Loaned": 0, "Returned": 0, "Returned(Late)": 0}
    );

    const BookLoanedGenresCount = loanedBooks.reduce<Record<string, number>>((prev, curr) => 
        {
            const genre = curr.genreDetails.genre;

            prev[genre] = (prev[genre] ?? 0) + 1;

            return prev;
        },
        {}
    );

    const AllBooksGenresCount = (AllBooks as AllBooksAggregationResult[]).reduce<Record<string, number>>((prev, curr) => 
        {
            const genre = curr.genreDetails.genre;

            prev[genre] = (prev[genre] ?? 0) + 1;

            return prev;
        },
        {}
    )

    const DataHandler: BookDashboardData = {BooksCount, BookLoanedCount, LoanedStatusCount, AllBooksGenresCount, BookLoanedGenresCount};
    await PutDataIntoDynamoDB("DashboardData", "books", DataHandler);
    return { success: true, statusCode: 200, message: "Get book dashboard data successfully!", data: DataHandler }
}


export const GenerateBookDashboardInsight = (data: BookDashboardData) =>
{
    if (!data)
    {
        return { insightItems: ["N/A"] };
    }

    const GenreRatios = Object.entries(data.AllBooksGenresCount).reduce<Record<string, number>>((prev, [genre, totalBooks]) =>
        {
            const loanedBooks = data.BookLoanedGenresCount[genre] ?? 0;
            prev[genre] = loanedBooks / totalBooks;
            return prev;
        },
        {}
    );

    const ratios = Object.entries(GenreRatios);
    const highest = ratios.reduce((prev, curr) => curr[1] > prev[1] ? curr: prev);
    const lowest = ratios.reduce((prev, curr) => curr[1] < prev[1] ? curr : prev);

    return {
        insightItems:
        [
            `${highest[0]} shows the strongest borrowing demand relative to its catalogue size`,
            `${lowest[0]} titles appear underutilised compared with their availability in the library collection`
        ]
    };
}