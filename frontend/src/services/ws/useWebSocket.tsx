import { useEffect } from "react";

type WsMessage<T> = 
{
    event: keyof T;
    payload: any;
};

export const useWebSocket = async <T extends Record<string, string>>(dispatch: React.Dispatch<any>, eventMap: T) => 
{
    useEffect(() => 
    {
        const ws = new WebSocket(`${process.env.REACT_APP_WEB_SOCKET_SERVER}` as string);

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

        ws.onerror = (error) => 
        {
            console.error(`WebSocket error: ${error}`);
        };

        ws.onclose = () => console.log("Disconnected from WS server");

        return () => ws.close();

    }, [dispatch, eventMap]);
};
