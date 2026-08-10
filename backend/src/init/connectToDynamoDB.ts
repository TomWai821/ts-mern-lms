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
        await db.delete({ TableName: "WebSocketConnections", Key: { connectionId }}).promise();

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
        const api = new ApiGatewayManagementApi({ endpoint });

        const message = JSON.stringify({ event: "error", payload: { message: "Unknown route or action" }});

        await api.postToConnection({ ConnectionId: event.requestContext.connectionId,Data: message }).promise();

        return { statusCode: 200, body: "Message received" };
    } 
    catch (error) 
    {
        console.error("Default handler error:", error);
        return { statusCode: 500, body: "Default handler failed" };
    }
};

export const broadcastForAWS = async (event: ApiGatewayWebSocketEvent, wsEvent: string, payload: any) => 
{
    try
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
            catch (error: any) 
            {
                if (error.statusCode === 410) 
                {
                    await db.delete({ TableName: "WebSocketConnections", Key: { connectionId: conn.connectionId }}).promise();
                }
            }
        }
    }
    catch(error)
    {
        console.error("Broadcast error:", error);
        return { statusCode: 500, body: "Broadcast failed" };
    }
};