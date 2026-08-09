import { GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.REACT_APP_BACKEND_BASE_URL;
const baseUrl = `${localhost}/api/recommend`
const contentType:string = "application/json";

export const fetchSuggestBook = async (type:string, authToken?:string) => 
{
    const headers: Record<string, string> = 
    {
        'content-type': contentType
    }

    if(authToken)
    {
        headers['authToken'] = authToken;
    }

    let response: Response;

    if(type === "forUser")
    {
        response = await fetch(`${baseUrl}/type=${type}`, 
        {
            method: 'POST',
            headers: headers,
        });
    }
    else
    {
        const url = type === "mostPopular" ? `${baseUrl}/type=${type}` : `${baseUrl}/type=${type}`
    
        response = await fetch(url,
            {
                method: 'GET',
                headers: headers,
            }
        );
    }

    if(response.ok)
    {
        const result: GetResultInterface = await response.json();
        console.log(result);
        return result;
    }
}