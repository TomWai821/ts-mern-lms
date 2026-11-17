import { GetDataFromDynamoDB } from "../dynamoDB/dynamoDBService";
import { bookDashboardDTO, GenerateBookDashboardInsight } from "./bookDashboardDTO";
import { finesDashboardDTO, GenerateFinesDashboardInsight } from "./finesDashboardDTO";
import {GenerateUserDashboardInsight, userDashboardDTO } from "./userDashboardDTO";

export type dashboardDataType = "users" | "books" | "fines";

const DashboardServicesMap =
{
    users: { DTO: userDashboardDTO, Insight: GenerateUserDashboardInsight },
    books: { DTO: bookDashboardDTO, Insight: GenerateBookDashboardInsight },
    fines: {DTO: finesDashboardDTO, Insight: GenerateFinesDashboardInsight }
}

export const DashboardService = async (type: dashboardDataType) => 
{
    const cacheData = await GetDashboardDataFromDynamoDB(type);

    if(cacheData)
    {
        return cacheData;
    }

    return await DashboardServicesMap[type]["DTO"]();
}

export const RefreshDashboard = async (type: dashboardDataType): Promise<void> =>
{
    try
    {
        await DashboardServicesMap[type]["DTO"]();
    }
    catch (error)
    {
        console.error(`Refresh dashboard failed: ${type}`, error);
    }
}

export const InitialiseDashboardCache = async (): Promise<void> =>
{
    await Promise.all([
        DashboardServicesMap.users["DTO"](),
        DashboardServicesMap.books["DTO"](),
        DashboardServicesMap.fines["DTO"]()
    ]);
}

const GetDashboardDataFromDynamoDB = async (type: dashboardDataType) =>
{
    const result = await GetDataFromDynamoDB("DashboardData", type);

    if(!result.Item)
    {
        return null;
    }

    const insight = DashboardServicesMap[type]["Insight"](result.Item.data);

    return {success: true, statusCode: 200, message: `Get ${type} dashboard data successfully!`, data: result.Item.data, insight: insight.insightItems};
}