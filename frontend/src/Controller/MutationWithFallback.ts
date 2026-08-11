export const executeMutationWithFallback = async (action: () => Promise<Response>, getAllDataFunction?: () => Promise<void>): Promise<Response> => 
{
    const wsUrl = process.env.REACT_APP_WEB_SOCKET_SERVER;

    const isWsActive = Boolean(wsUrl && wsUrl !== 'undefined' && wsUrl !== 'null');

    const result = await action();

    if (result && result.ok && !isWsActive && getAllDataFunction) 
    {
        console.log('[Fallback] WS inactive, triggering manual refetch...');
        await getAllDataFunction();
    }

    return result;
};