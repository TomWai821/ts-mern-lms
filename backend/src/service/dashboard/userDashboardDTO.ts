import { GetSuspendListCount } from "../../schema/user/suspendList";
import { GetUserCount } from "../../schema/user/user";
import { PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";

export interface UserDashboardData
{
    UserCount: number;
    UserCurrentlySuspendCount: number;
    SuspendListSuspendUserCount: number;
    SuspendListUnsuspendUserCount: number;
}

export const userDashboardDTO = async() =>
{
    const [UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount] = await Promise.all(
        [GetUserCount(), GetUserCount({status: "Suspend"}), GetSuspendListCount({status: "Suspend"}), GetSuspendListCount({status: "Unsuspend"})]
    );

    const DataHandler: UserDashboardData = {UserCount, UserCurrentlySuspendCount, SuspendListSuspendUserCount, SuspendListUnsuspendUserCount};
    await PutDataIntoDynamoDB("DashboardData", "users", DataHandler);

    return { success: true, statusCode: 200, message: "Get user dashboard data successfully!", data: DataHandler}
}

export const GenerateUserDashboardInsight = (data: UserDashboardData) =>
{
    if(!data)
    {
        return {insightItems: ["N/A"]};
    }

    const verb = data.UserCurrentlySuspendCount === 1 ? "is" : "are";

    return {
        insightItems: 
        [
            `${data.UserCurrentlySuspendCount} of ${data.UserCount} registered users ${verb} currently suspended`,
            "Most suspension records have been resolved through subsequent unsuspension actions"
        ]
    };
}