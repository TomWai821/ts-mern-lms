type MethodType = "GET" | "POST" | "PUT" | "DELETE";

const AjaxUtils = async <T, R = Response>(requestMethod: MethodType, url:string, authToken?:string, body?: T) => 
{
    try
    {   
        const headers: Record<string, string> = { 'content-type': 'application/json' }

        if(authToken) headers['authToken'] = authToken;
        
        const response = await fetch(url,
            {
                method: requestMethod,
                headers: headers,
                body: body ? JSON.stringify(body): undefined
            }
        )

        return response as R;
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}