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
    console.log(`connect:${event}`);
    const connectionId = event.requestContext.connectionId;

    await db.put({ TableName: "WebSocketConnections", Item: { connectionId, connectedAt: Date.now() }}).promise();

    return { statusCode: 200 };
};

export const disconnectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    console.log(`disconnect:${event}`);
    const connectionId = event.requestContext.connectionId;

    await db.delete({ TableName: "WebSocketConnections", Key: { connectionId }}).promise();

    return { statusCode: 200 };
};

export const defaultHandler = async (event: ApiGatewayWebSocketEvent) =>
{
    console.log(`default:${event}`);
    const endpoint =  `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    console.log(endpoint);
    const api = new ApiGatewayManagementApi({endpoint});

    const message = JSON.stringify({ event: "error", payload: { message: "Unknown route or action" }});

    await api.postToConnection({ConnectionId: event.requestContext.connectionId, Data: message}).promise();

    return { statusCode: 200 };
};

export const broadcastForAWS = async (event: ApiGatewayWebSocketEvent, wsEvent: string, payload: any) => 
{
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
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