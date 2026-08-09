import { useEffect } from "react";

type WsMessage<T> = 
{
    event: keyof T;
    payload: any;
};

export const useWebSocket = <T extends Record<string, string>>(dispatch: React.Dispatch<any>, eventMap: T) => 
{
    useEffect(() => 
    {
        const ws = new WebSocket(`${process.env.REACT_APP_BACKEND_BASE_URL}/ws` as string);

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
            catch (err) 
            {
                console.error("WS parse error:", err);
            }
        };

        ws.onclose = () => console.log("Disconnected from WS server");
        return () => ws.close();
    }, [dispatch, eventMap]);
};
