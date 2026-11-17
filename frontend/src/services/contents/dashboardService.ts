const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const baseUrl = `${localhost}/api/dashboard`
const contentType:string = "application/json";

type DashboardDataType = "users" | "books" | "fines";

export interface DashboardDataResponse<T>
{
    success: boolean;
    data: T;
    insight: string[];
}

export interface UserDashboardData
{
    UserCount: number;
    UserCurrentlySuspendCount: number;
    SuspendListSuspendUserCount: number;
    SuspendListUnsuspendUserCount: number;
}

export interface BookDashboardData
{
    BooksCount: number;
    BookLoanedCount: number;
    AllBooksGenresCount: Record<string, number>;
    BookLoanedGenresCount: Record<string, number>;
    LoanedStatusCount: Record<string, number>;
}

export interface FinesDashboardData
{
    FinesNotPaidCount: number;
    FinesPaidCount: number;
    TotalFinesAmount: number;
    FinesDetails: {"Paid": number, "Not Paid": number};
    NotPaidFinesRecordDetails: {"Not Return Book": number, "Return Book": number};
}

type DashboardResponseMap = 
{
    users: DashboardDataResponse<UserDashboardData>;
    books: DashboardDataResponse<BookDashboardData>;
    fines: DashboardDataResponse<FinesDashboardData>;
};

export async function GetDashboardData() 
{
    const [usersData, booksData, finesData] = await Promise.all([GetData("users"), GetData("books"), GetData("fines")]);
    return {usersData, booksData, finesData};
}

async function GetData<T extends DashboardDataType>(type: T): Promise<DashboardResponseMap[T]>
{
    const response = await fetch(`${baseUrl}/type=${type}`,
    {
        method: "GET",
        credentials: "include",
        headers: { "content-type": contentType }
    });

    const result = await response.json();
    return result as DashboardResponseMap[T];
}