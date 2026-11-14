import { BookLoanedAggregationResult, BookReturnStatus, GetBookLoaned, GetBookLoanedCount } from "../../schema/book/bookLoaned";
import { AllBooksAggregationResult, GetBook, GetBookCount } from "../../schema/book/book";
import { GetSuspendListCount } from "../../schema/user/suspendList";
import { GetUserCount } from "../../schema/user/user";
import { BookLoanedInterface } from "../../model/bookSchemaInterface";

export type dashboardDataType = "users" | "books" | "fines";

export const DashboardService = async (type: dashboardDataType) => 
{
    switch(type)
    {
        case "users":
            return await userDashboardDTO();

        case "books":
            return await bookDashboardDTO();

        case "fines":
            return await finesDashboardDTO();

        default:
            console.error(`Invalid dashboard type: ${type}`);
            return {success: false, statusCode: "", message: `Invalid dashboard type: ${type}`, data: []};
    }
}

const userDashboardDTO = async () => 
{
    const [UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount] = await Promise.all(
        [GetUserCount(), GetUserCount({status: "Suspend"}), GetSuspendListCount({status: "Suspend"}), GetSuspendListCount({status: "Unsuspend"})]
    );

    const DataHandler = {UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount};

    return { success: true, statusCode: 200, message: "Get user dashboard data successfully!", data: DataHandler}
}


const bookDashboardDTO = async () => 
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

    const DataHandler = {BooksCount, BookLoanedCount, LoanedStatusCount, AllBooksGenresCount, BookLoanedGenresCount}

    return { success: true, statusCode: 200, message: "Get book dashboard data successfully!", data: DataHandler }
}

const finesDashboardDTO = async () => 
{
    const [FinesPaidCount, FinesNotPaidCount, AllLoanBooks ] = await Promise.all(
        [GetBookLoanedCount({finesPaidStatus: "Paid"}), GetBookLoanedCount({finesPaidStatus: "Not Paid"}), GetBookLoaned()]
    );

    const LoanBookRecords = AllLoanBooks as BookLoanedInterface[];
    const NotPaidFinesRecords = LoanBookRecords.filter(loanBooks => loanBooks.finesPaid === "Not Paid");

    const TotalFinesAmount: Record<string, number> = LoanBookRecords.reduce((prev, curr) => 
        {   
            prev["sum"] += curr.fineAmount; 
            return prev; 
        },
        { sum: 0 }
    );

    const FinesDetails: Record<string, number> = LoanBookRecords.reduce((prev, curr) => 
        {   
            if(curr.finesPaid === "Paid")
            {
                prev["Paid"] += curr.fineAmount;
            }

            if(curr.finesPaid === "Not Paid")
            {
                prev["Not Paid"] += curr.fineAmount;
            }

            return prev;
        },
        { "Paid": 0, "Not Paid": 0 }
    );

    const NotPaidFinesRecordDetails = 
    {
        "Return Book": NotPaidFinesRecords.filter(notPaidFinesRecord => notPaidFinesRecord.status === "Returned(Late)").length,
        "Not Return Book": NotPaidFinesRecords.filter(notPaidFinesRecord => notPaidFinesRecord.status === "Loaned").length
    }

    const DataHandler = {FinesPaidCount, FinesNotPaidCount, TotalFinesAmount, FinesDetails, NotPaidFinesRecordDetails}

    return { success: true, statusCode: 200, message: "Get fines dashboard data successfully!", data: DataHandler }
}