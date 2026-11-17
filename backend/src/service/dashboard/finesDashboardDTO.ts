import { BookLoanedInterface } from "../../model/bookSchemaInterface";
import { GetBookLoanedCount, GetBookLoaned } from "../../schema/book/bookLoaned";
import { GetDataFromDynamoDB, PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";

export interface FinesDashboardData
{
    FinesPaidCount: number | undefined;
    FinesNotPaidCount: number | undefined;
    TotalFinesAmount: number;
    FinesDetails: { "Paid": number, "Not Paid": number };
    NotPaidFinesRecordDetails: { "Return Book": number; "Not Return Book": number; };
}

export const finesDashboardDTO = async() =>
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
    const insight = GenerateFinesDashboardInsight(DataHandler);

    return { success: true, statusCode: 200, message: "Get fines dashboard data successfully!", data: DataHandler, insight: insight.insightItems }
}

export const GenerateFinesDashboardInsight = (data: FinesDashboardData) =>
{
    if (!data)
    {
        return { insightItems: ["N/A"] };
    }

    return {
        insightItems:
        [
            `${data.NotPaidFinesRecordDetails["Not Return Book"]} overdue loan records have not yet been returned`,
            `Outstanding fines currently total HKD$ ${data.FinesDetails["Not Paid"]}`
        ]
    };
}