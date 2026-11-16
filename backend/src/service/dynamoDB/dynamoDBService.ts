import { dynamoDB } from "../../init/connectToDynamoDB";
import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { BookLoanedAggregationResult } from "../../schema/book/bookLoaned";
import { UserDashboardData, BookDashboardData, FinesDashboardData } from "../dashboard/dashboardService";
import { BookInterface } from "../../model/bookSchemaInterface";

export type DynamoDBTableMap = 
{
    RecommendBook: 
    {
        newPublish: BookInterface[];
        mostPopular: BookLoanedAggregationResult[];
        forUser: BookInterface[];
    };

    DashboardData: 
    {
        users: UserDashboardData;
        books: BookDashboardData;
        fines: FinesDashboardData;
    };
};

type DynamoDBTableName = keyof DynamoDBTableMap;

type DynamoDBJsonValue = string | number | boolean | null | DynamoDBJsonValue[] | { [key: string]: DynamoDBJsonValue };

export const GetDataFromDynamoDB = async<T extends keyof DynamoDBTableMap>(tableName: T, dataType: keyof DynamoDBTableMap[T], userId?: string) => 
{
    let keyData = BuildKey(tableName, dataType, userId);
    return await dynamoDB.send(new GetCommand({ TableName: tableName, Key: keyData }));
}

export const PutDataIntoDynamoDB = async<T extends keyof DynamoDBTableMap, D extends keyof DynamoDBTableMap[T]>(tableName: T, dataType: D, data: DynamoDBTableMap[T][D], userId?: string) => 
{
    return await dynamoDB.send(new PutCommand({TableName: tableName, Item: BuildItem(tableName, dataType, data, userId) }));
}

export const DeleteDataFromDynamoDB = async<T extends keyof DynamoDBTableMap>(tableName: T, dataType: keyof DynamoDBTableMap[T], userId?: string) => 
{
    return await dynamoDB.send(new DeleteCommand({ TableName: tableName, Key: BuildKey(tableName, dataType, userId) }));
}

const BuildKey = <T extends DynamoDBTableName>(tableName: T, dataType: keyof DynamoDBTableMap[T], userId?: string) =>
{
    if (tableName === "RecommendBook")
    {
        if (dataType === "forUser")
        {
            if (!userId)
            {
                throw new Error("userId required");
            }

            return { dataType, userId };
        }

        return { dataType, userId: "global" };
    }

    return { dataType };
};

const BuildItem = <T extends keyof DynamoDBTableMap,D extends keyof DynamoDBTableMap[T]>(tableName: T, dataType: D, data: DynamoDBTableMap[T][D], userId?: string) =>
{
    return { ...BuildKey(tableName, dataType, userId), data: SerializeDynamoDBData(data) };
};

const SerializeDynamoDBData = (data: unknown): DynamoDBJsonValue =>
{
    const serialisedData = JSON.stringify(data);
    if (serialisedData === undefined)
    {
        throw new TypeError("DynamoDB data must be JSON serialisable");
    }

    return JSON.parse(serialisedData) as DynamoDBJsonValue;
};