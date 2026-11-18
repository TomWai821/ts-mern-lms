import { RefreshRecommendationCache } from "../service/recommendation/bookRecommendationService";
import { InitialiseDashboardCache } from "../service/dashboard/dashboardService";
import { CreateTableCommand, DescribeTableCommand, ListTablesCommand, DynamoDBClient, ResourceInUseException, ResourceNotFoundException, waitUntilTableExists } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient(
    {
        region: process.env.AWS_REGION,
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    }
);

export const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

export const checkDynamoDBConnection = async () =>
{
    try
    {
        await dynamoDB.send(new ListTablesCommand({}) );
        console.log("DynamoDB connected");
    }
    catch(error)
    {
        console.error(error);
        process.exit(1);
    }
}

export const InitialiseSystem = async () =>
{
    await CreateRecommendBookTableIfNotExists();
    await CreateDashboardDataTableIfNotExists();

    await Promise.all([InitialiseRecommendationCache(), InitialiseDashboardCache()]);
};

const CreateDashboardDataTableIfNotExists = async () =>
{
    try
    {
        await dynamoDB.send(new DescribeTableCommand({ TableName: "DashboardData" }));
    }
    catch (error)
    {
        if (!(error instanceof ResourceNotFoundException))
        {
            throw error;
        }

        try
        {
            await dynamoDB.send(new CreateTableCommand({
                TableName: "DashboardData",
                KeySchema: [{ AttributeName: "dataType", KeyType: "HASH" }],
                AttributeDefinitions: [{ AttributeName: "dataType", AttributeType: "S" }],
                BillingMode: "PAY_PER_REQUEST"
            }));
        }
        catch (createError)
        {
            if (!(createError instanceof ResourceInUseException))
            {
                throw createError;
            }
        }
    }

    await waitUntilTableExists({ client: dynamoClient, maxWaitTime: 60 }, { TableName: "DashboardData" });
    console.log("DashboardData table is ready");
};

const CreateRecommendBookTableIfNotExists = async () =>
{
    try
    {
        await dynamoDB.send(new DescribeTableCommand({ TableName: "RecommendBook" }));
    }
    catch(error)
    {
        if (!(error instanceof ResourceNotFoundException))
        {
            throw error;
        }

        try
        {
            await dynamoDB.send(new CreateTableCommand({TableName: "RecommendBook",
                KeySchema:
                [
                    { AttributeName: "dataType", KeyType: "HASH" },
                    { AttributeName: "userId", KeyType: "RANGE" }
                ],
                AttributeDefinitions: 
                [
                    { AttributeName: "dataType", AttributeType: "S" },
                    { AttributeName: "userId", AttributeType: "S" }
                ],
                BillingMode: "PAY_PER_REQUEST"
            }));
        }
        catch (createError)
        {
            if (!(createError instanceof ResourceInUseException))
            {
                throw createError;
            }
        }

        await waitUntilTableExists({ client: dynamoClient, maxWaitTime: 60 }, { TableName: "RecommendBook" });
        console.log("RecommendBook table created");
    }
};

export const InitialiseRecommendationCache = async () =>
{
    await Promise.all([RefreshRecommendationCache("newPublish"), RefreshRecommendationCache("mostPopular")]);
};