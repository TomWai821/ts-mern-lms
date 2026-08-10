import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";

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

const db = new DynamoDB.DocumentClient();

export const connectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    const connectionId = event.requestContext.connectionId;

    await db.put({ TableName: "WebSocketConnections", Item: { connectionId, connectedAt: Date.now() }}).promise();

    return { statusCode: 200, body: "Connected" };
};

export const disconnectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    const connectionId = event.requestContext.connectionId;

    await db.delete({ TableName: "WebSocketConnections", Key: { connectionId }}).promise();

    return { statusCode: 200, body: "Disconnected" };
};

export const defaultHandler = async (event: ApiGatewayWebSocketEvent) =>
{
    const endpoint =  `https://${event.requestContext.domainName}`;
    const api = new ApiGatewayManagementApi({endpoint});

    const message = JSON.stringify({ event: "error", payload: { message: "Unknown route or action" }});

    await api.postToConnection({ConnectionId: event.requestContext.connectionId, Data: message}).promise();

    return { statusCode: 200, body: "Message received" };
};

export const broadcastForAWS = async (event: ApiGatewayWebSocketEvent, wsEvent: string, payload: any) => 
{
    const endpoint = `https://${event.requestContext.domainName}`;
    const api = new ApiGatewayManagementApi({endpoint});
    const message = JSON.stringify({ event: wsEvent, payload });

    const connections = await db.scan({ TableName: "WebSocketConnections" }).promise();

    for (const conn of connections.Items || [])
    {
        try 
        {
            await api.postToConnection({ ConnectionId: conn.connectionId, Data: message}).promise();
        } 
        catch (err: any) 
        {
            if (err.statusCode === 410) 
            {
                await db.delete({ TableName: "WebSocketConnections", Key: { connectionId: conn.connectionId }}).promise();
            }
        }
    }
};