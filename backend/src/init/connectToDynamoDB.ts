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
    try 
    {
        const connectionId = event.requestContext.connectionId;
        await db.put({ TableName: "WebSocketConnections", Item: { connectionId, connectedAt: Date.now() }}).promise();

        return { statusCode: 200, body: "Connected" };
    } 
    catch (err) 
    {
        console.error("Connect error:", err);
        return { statusCode: 500, body: "Connect failed" };
    }
};

export const disconnectHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    try 
    {
        const connectionId = event.requestContext.connectionId;
        await db.delete({ TableName: "WebSocketConnections", Key: { connectionId }}).promise();

        return { statusCode: 200, body: "Disconnected" };
    } 
    catch (err) 
    {
        console.error("Disconnect error:", err);
        return { statusCode: 500, body: "Disconnect failed" };
    }
};

export const defaultHandler = async (event: ApiGatewayWebSocketEvent) => 
{
    try 
    {
        const endpoint = `https://${event.requestContext.domainName}`;
        const api = new ApiGatewayManagementApi({ endpoint });

        const message = JSON.stringify({ event: "error", payload: { message: "Unknown route or action" }});

        await api.postToConnection({ ConnectionId: event.requestContext.connectionId,Data: message }).promise();

        return { statusCode: 200, body: "Message received" };
    } 
    catch (err) 
    {
        console.error("Default handler error:", err);
        return { statusCode: 500, body: "Default handler failed" };
    }
};
