import { BookLoanedAggregationResult, BookReturnStatus, GetBookLoaned, GetBookLoanedCount } from "../../schema/book/bookLoaned";
import { AllBooksAggregationResult, GetBook, GetBookCount } from "../../schema/book/book";
import { GetSuspendListCount } from "../../schema/user/suspendList";
import { GetUserCount } from "../../schema/user/user";
import { BookLoanedInterface } from "../../model/bookSchemaInterface";
import { GetDataFromDynamoDB, PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";

export type dashboardDataType = "users" | "books" | "fines";

const DashboardServicesMap =
{
    users: userDashboardDTO,
    books: bookDashboardDTO,
    fines: finesDashboardDTO
}

export const DashboardService = async (type: dashboardDataType) => 
{
    const cacheData = await GetDashboardDataFromDynamoDB(type);

    if(cacheData)
    {
        return cacheData;
    }

    return await DashboardServicesMap[type]();
}

export const RefreshDashboard = async (type: dashboardDataType): Promise<void> =>
{
    try
    {
        await DashboardServicesMap[type]();
    }
    catch (error)
    {
        console.error(`Refresh dashboard failed: ${type}`, error);
    }
}

export const InitialiseDashboardCache = async (): Promise<void> =>
{
    await Promise.all([
        DashboardServicesMap.users(),
        DashboardServicesMap.books(),
        DashboardServicesMap.fines()
    ]);
}

const GetDashboardDataFromDynamoDB = async (type: dashboardDataType) =>
{
    const result = await GetDataFromDynamoDB("DashboardData", type);

    if(!result.Item)
    {
        return null;
    }

    return {success: true, statusCode: 200, message: `Get ${type} dashboard data successfully!`, data: result.Item.data};
}

export interface UserDashboardData
{
    UserCount: number;
    UserCurrentlySuspendCount: number;
    SuspendListSuspendUserCount: number;
    SuspendListUnsuspendUserCount: number;
}

async function userDashboardDTO()
{
    const [UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount] = await Promise.all(
        [GetUserCount(), GetUserCount({status: "Suspend"}), GetSuspendListCount({status: "Suspend"}), GetSuspendListCount({status: "Unsuspend"})]
    );

    const DataHandler: UserDashboardData = {UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount};
    await PutDataIntoDynamoDB("DashboardData", "users", DataHandler);

    return { success: true, statusCode: 200, message: "Get user dashboard data successfully!", data: DataHandler}
}

export interface BookDashboardData
{
    BooksCount: number | undefined;
    BookLoanedCount: number | undefined;
    LoanedStatusCount: Record<"Returned" | "Loaned" | "Returned(Late)", number>;
    AllBooksGenresCount: Record<string, number>;
    BookLoanedGenresCount: Record<string, number>;
}

async function bookDashboardDTO()
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

export interface FinesDashboardData
{
    FinesPaidCount: number | undefined;
    FinesNotPaidCount: number | undefined;
    TotalFinesAmount: number;
    FinesDetails: { "Paid": number, "Not Paid": number };
    NotPaidFinesRecordDetails: { "Return Book": number; "Not Return Book": number; };
}

async function finesDashboardDTO()
{
    const [FinesPaidCount, FinesNotPaidCount, AllLoanBooks ] = await Promise.all(
        [GetBookLoanedCount({finesPaidStatus: "Paid"}), GetBookLoanedCount({finesPaidStatus: "Not Paid"}), GetBookLoaned()]
    );

    const LoanBookRecords = AllLoanBooks as BookLoanedInterface[];
    const NotPaidFinesRecords = LoanBookRecords.filter(loanBooks => loanBooks.finesPaid === "Not Paid");

    const TotalFinesAmount = LoanBookRecords.reduce((sum, curr) => sum += curr.fineAmount, 0);

    const FinesDetails = LoanBookRecords.reduce((prev, curr) => 
        {   
            if (curr.finesPaid === "Paid")
            {
                prev["Paid"]  += curr.fineAmount;
            }

            if (curr.finesPaid === "Not Paid")
            {
                prev["Not Paid"] += curr.fineAmount;
            }

            return prev;
        },
        { "Paid": 0, "Not Paid": 0 }
    );

    const NotPaidFinesRecordDetails = NotPaidFinesRecords.reduce((prev, curr) =>
        {
            if (curr.status === "Returned(Late)")
            {
                prev["Return Book"]++;
            }

            if (curr.status === "Loaned")
            {
                prev["Not Return Book"]++;
            }

            return prev;
        },
        { "Return Book": 0, "Not Return Book": 0 }
    );

    const DataHandler: FinesDashboardData = {FinesPaidCount, FinesNotPaidCount, TotalFinesAmount, FinesDetails, NotPaidFinesRecordDetails}
    await PutDataIntoDynamoDB("DashboardData", "fines", DataHandler);

    return { success: true, statusCode: 200, message: "Get fines dashboard data successfully!", data: DataHandler }
}