import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { AWS_REGION } from '../init/connectToS3';

export interface ApiGatewayWebSocketEvent 
{
    requestContext: 
    {
        connectionId: string;
        domainName: string;
        stage: string;
        routeKey: string;
    };
    body?: string;
}

const TABLE_NAME = process.env.WS_CONNECTION_TABLE_NAME || "WebSocketConnections";
const REGION = AWS_REGION || "ap-east-1";

const ddbClient = new DynamoDBClient({ region: REGION });
const db = DynamoDBDocumentClient.from(ddbClient);

export const wsHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    const route = event.requestContext.routeKey;

    switch (route) 
    {
        case '$connect':
            return await connectHandler(event);

        case '$disconnect':
            return await disconnectHandler(event);

        case '$default':
            return await defaultHandler(event);

        default:
            return { statusCode: 400, body: 'Unsupported route' };
    }
};

export const connectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    try 
    {
        const connectionId = event.requestContext.connectionId;
        const domainName = event.requestContext.domainName;
        const stage = event.requestContext.stage;

        await db.send(new PutCommand(
        { 
            TableName: TABLE_NAME, 
            Item: { connectionId, connectedAt: Date.now(), domainName, stage }
        }));

        return { statusCode: 200, body: "Connected" };
    } 
    catch (error) 
    {
        console.error("Connect error:", error);
        return { statusCode: 500, body: "Connect failed" };
    }
};

export const disconnectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    try 
    {
        const connectionId = event.requestContext.connectionId;

        await db.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { connectionId }}));

        return { statusCode: 200, body: "Disconnected" };
    } 
    catch (error) 
    {
        console.error("Disconnect error:", error);
        return { statusCode: 500, body: "Disconnect failed" };
    }
};

export const defaultHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    try 
    {
        const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
        const api = new ApiGatewayManagementApiClient({ endpoint });

        const message = JSON.stringify({ event: "error", payload: { message: "Unknown route or action" } });

        await api.send(new PostToConnectionCommand({ ConnectionId: event.requestContext.connectionId, Data: Buffer.from(message)}));

        return { statusCode: 200, body: "Message received" };
    } 
    catch (error) 
    {
        console.error("Default handler error:", error);
        return { statusCode: 500, body: "Default handler failed" };
    }
};

export const broadcastForAWS = async (wsEvent: string, payload: any) => 
{
    try 
    {
        const connections = await db.send(new ScanCommand({ TableName: TABLE_NAME }));
        const items = connections.Items || [];

        await Promise.allSettled(
            items.map(async (conn) => 
            {
                if (!conn.connectionId || !conn.domainName || !conn.stage) return;

                const endpoint = `https://${conn.domainName}/${conn.stage}`;
                const api = new ApiGatewayManagementApiClient({ endpoint });
                const message = Buffer.from(JSON.stringify({ event: wsEvent, payload }));

                try 
                {
                    await api.send(new PostToConnectionCommand({ ConnectionId: conn.connectionId, Data: message }));
                } 
                catch (error: any) 
                {
                    if (error.$metadata?.httpStatusCode === 410) 
                    {
                        await db.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { connectionId: conn.connectionId }}));
                    }
                }
            })
        );

        return { statusCode: 200, body: "Broadcast sent" };
    } 
    catch (error) 
    {
        console.error("Broadcast error:", error);
        return { statusCode: 500, body: "Broadcast failed" };
    }
};