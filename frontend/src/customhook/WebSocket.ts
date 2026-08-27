import { useEffect, useRef } from "react";

type WsMessage<T> = 
{
    event: keyof T;
    payload: any;
};

export const useWebSocket = <T extends Record<string, string>>(dispatch: React.Dispatch<any>, eventMap: T) => 
{
    const eventMapRef = useRef(eventMap);
    useEffect(() => 
    {
        eventMapRef.current = eventMap;
    }, [eventMap]);
    
    useEffect(() => 
    {
        const wsUrl = process.env.REACT_APP_WEB_SOCKET_SERVER;

        
        if (!wsUrl || wsUrl === 'undefined' || wsUrl === 'null') 
        {
            console.log('[WS] WebSocket URL is not configured, Skipping connection');
            return;
        }

        let ws: WebSocket;

        try
        {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => console.log("Connected to WS server");

            ws.onmessage = (msg) => 
            {
                try 
                {
                    const data: WsMessage<T> = JSON.parse(msg.data);
                    const actionType = eventMap[data.event];
                    
                    if (actionType) 
                    {
                        dispatch({ type: actionType, payload: data.payload });
                    }
                } 
                catch (error) 
                {
                    console.error(`WebSocket parse error: ${error}`);
                }
            };

            ws.onerror = (event) => 
            {
                console.error(`WebSocket error event: ${JSON.stringify(event)}`);
            };

            ws.onclose = () => console.log("Disconnected from WS server");

            return () => ws.close();
        }
        catch (error) 
        {
            console.error(`Failed to create WebSocket instance: ${error}`);
        }
        

    }, [dispatch, eventMap]);
};
