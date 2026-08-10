import { WebSocketServer, WebSocket } from "ws";
import { config } from "./config/config";
import { ApiGatewayWebSocketEvent, broadcastForAWS } from "./init/connectToDynamoDB";

export enum UserEvent 
{
    USER_CREATE = "user_create",
    USER_UPDATE = "user_update",
    USER_DELETE = "user_delete",
    SUSPEND_USER_CREATE = "suspend_user_create",
    SUSPEND_USER_UPDATE = "suspend_user_update",
    SUSPEND_USER_DELETE = "suspend_user_delete"
}

export enum BookEvent
{
    BOOK_CREATE = "book_create",
    BOOK_UPDATE = "book_update",
    BOOK_DELETE = "book_delete",
    LOAN_BOOK_CREATE = 'loan_book_create',
    LOAN_BOOK_UPDATE = "loan_book_update",
    LOAN_BOOK_DELETE = 'loan_book_delete'
}

export enum ContactEvent
{
    AUTHOR_CREATE = "author_create",
    AUTHOR_UPDATE = "author_update",
    AUTHOR_DELETE = "author_delete",
    PUBLISHER_CREATE = "publisher_create",
    PUBLISHER_UPDATE = "publisher_update",
    PUBLISHER_DELETE = "publisher_delete"
}

export enum DefinitionEvent
{
    GENRE_CREATE = "genre_create",
    GENRE_UPDATE = "genre_update",
    GENRE_DELETE = "genre_delete",
    LANGUAGE_CREATE = "language_create",
    LANGUAGE_UPDATE = "language_update",
    LANGUAGE_DELETE = "language_delete"
}

type WebSocketEvent = UserEvent | BookEvent | ContactEvent | DefinitionEvent;

let wss: WebSocketServer;

export const initWsServer = (server: any) =>
{
    wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (ws: WebSocket) => 
    {
        console.log("Client connected");
        ws.on("close", () => console.log("Client disconnected"));
    });
}

const broadcastForLocal = (event: WebSocketEvent, payload: any) =>
{
    if (!wss) return;

    const message = JSON.stringify({ event, payload });

    wss.clients.forEach((client: WebSocket) => 
    {
        if (client.readyState === client.OPEN) 
        {
            client.send(message);
        }
    });
}


export const broadcast = async (wsEvent: WebSocketEvent, payload: any) => 
{
    switch(config.STORAGE_TYPE)
    {
        case "S3":
            return broadcastForAWS(wsEvent, payload);

        default:
            return broadcastForLocal(wsEvent, payload);
    }
}