jest.mock("../src/service/dynamoDB/dynamoDBService", () => ({
    GetDataFromDynamoDB: jest.fn(),
    PutDataIntoDynamoDB: jest.fn()
}));

import { GetDataFromDynamoDB } from "../src/service/dynamoDB/dynamoDBService";
import { DashboardService } from "../src/service/dashboard/dashboardService";

describe("Dashboard service", () =>
{
    beforeEach(() => jest.clearAllMocks());

    it("returns cached dashboard data without the DynamoDB item envelope", async () =>
    {
        const data = 
        {
            UserCount: 4,
            UserCurrentlySuspendCount: 1,
            SuspendListSuspendUserCount: 1,
            SuspendListUnsuspendUserCount: 0
        };

        (GetDataFromDynamoDB as jest.Mock).mockResolvedValue({ Item: { dataType: "users", data } });

        await expect(DashboardService("users")).resolves.toEqual(
        {
            success: true,
            statusCode: 200,
            message: "Get users dashboard data successfully!",
            data
        });
    });
});
